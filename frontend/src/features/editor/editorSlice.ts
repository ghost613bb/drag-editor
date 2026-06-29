import { createSlice, current, isDraft, type PayloadAction } from '@reduxjs/toolkit'
import { duplicateNodeById } from '@/features/editor/duplicateNodeById'
import { findNodeById } from '@/features/editor/findNodeById'
import { insertNodeIntoContainerById } from '@/features/editor/insertNodeIntoContainerById'
import { mockPageSchema } from '@/features/editor/mockSchema'
import { moveNodeToContainerById } from '@/features/editor/moveNodeToContainerById'
import { removeNodeById } from '@/features/editor/removeNodeById'
import { reorderNodeWithinContainerById } from '@/features/editor/reorderNodeWithinContainerById'
import type { ComponentNode, ComponentPropsPatch, EditorState, NodeId, PageSchema } from '@/types/schema'

const MAX_HISTORY_ENTRIES = 50

interface UpdateNodePropsPayload {
  nodeId: NodeId
  patch: ComponentPropsPatch
  historyGroupId?: string
}

function getSnapshotSchema(schema: PageSchema) {
  return isDraft(schema) ? current(schema) : schema
}

function cloneSchema(schema: PageSchema) {
  return structuredClone(getSnapshotSchema(schema))
}

function areSchemasEqual(left: PageSchema | null, right: PageSchema | null) {
  if (!left || !right) {
    return left === right
  }

  return JSON.stringify(getSnapshotSchema(left)) === JSON.stringify(getSnapshotSchema(right))
}

function updateDirtyFromPublished(state: EditorState) {
  state.document.dirty = !areSchemasEqual(
    state.document.currentSchema,
    state.document.publishedSchema,
  )
}

function pushUndoSnapshot(state: EditorState) {
  state.history.past.push(cloneSchema(state.document.currentSchema))

  if (state.history.past.length > MAX_HISTORY_ENTRIES) {
    state.history.past.shift()
  }
}

function clearRedoStack(state: EditorState) {
  state.history.future = []
}

function shouldPushUndoSnapshotForMutation(state: EditorState, historyGroupId?: string) {
  if (!historyGroupId) {
    state.history.activePropertyEditGroup = null
    return true
  }

  if (state.history.activePropertyEditGroup === historyGroupId) {
    return false
  }

  state.history.activePropertyEditGroup = historyGroupId
  return true
}

function reconcileSelectedNode(state: EditorState) {
  const { selectedId } = state.ui

  if (!selectedId) {
    return
  }

  const selectedNode = findNodeById(state.document.currentSchema.root, selectedId)

  if (!selectedNode) {
    state.ui.selectedId = null
  }
}

function commitDocumentMutation(
  state: EditorState,
  nextSchema: PageSchema,
  options: { selectedId?: NodeId | null; statusMessage: string; historyGroupId?: string },
) {
  if (areSchemasEqual(state.document.currentSchema, nextSchema)) {
    return false
  }

  if (shouldPushUndoSnapshotForMutation(state, options.historyGroupId)) {
    pushUndoSnapshot(state)
  }

  clearRedoStack(state)

  state.document.currentSchema = nextSchema
  updateDirtyFromPublished(state)

  if ('selectedId' in options) {
    state.ui.selectedId = options.selectedId ?? null
  } else {
    reconcileSelectedNode(state)
  }

  if (state.document.dirty) {
    state.ui.saveStatus = 'idle'
  }

  state.ui.statusMessage = options.statusMessage

  return true
}

const initialState: EditorState = {
  document: {
    currentSchema: cloneSchema(mockPageSchema),
    publishedSchema: cloneSchema(mockPageSchema),
    dirty: false,
  },
  ui: {
    selectedId: null,
    hoveredId: null,
    saveStatus: 'idle',
    loadStatus: 'idle',
    statusMessage: '编辑器已初始化',
  },
  history: {
    past: [],
    future: [],
    activePropertyEditGroup: null,
  },
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    selectNode(state, action: PayloadAction<NodeId | null>) {
      state.history.activePropertyEditGroup = null
      state.ui.selectedId = action.payload
    },
    addNode(state, action: PayloadAction<{ node: ComponentNode; containerId?: NodeId }>) {
      const { node, containerId = state.document.currentSchema.root.id } = action.payload
      const nextSchema = cloneSchema(state.document.currentSchema)
      const insertedNode = insertNodeIntoContainerById(
        nextSchema.root,
        containerId,
        node,
      )

      if (!insertedNode) {
        return
      }

      commitDocumentMutation(state, nextSchema, {
        selectedId: insertedNode.id,
        statusMessage: `已新增 ${insertedNode.type} 组件`,
      })
    },
    reorderNodesInContainer(
      state,
      action: PayloadAction<{ containerId: NodeId; activeId: NodeId; overId: NodeId }>,
    ) {
      const { containerId, activeId, overId } = action.payload
      const nextSchema = cloneSchema(state.document.currentSchema)
      const movedNode = reorderNodeWithinContainerById(
        nextSchema.root,
        containerId,
        activeId,
        overId,
      )

      if (!movedNode) {
        return
      }

      commitDocumentMutation(state, nextSchema, {
        statusMessage: `已调整 ${movedNode.type} 组件顺序`,
      })
    },
    updateNodeProps(state, action: PayloadAction<UpdateNodePropsPayload>) {
      const { nodeId, patch, historyGroupId } = action.payload
      const nextSchema = cloneSchema(state.document.currentSchema)
      const node = findNodeById(nextSchema.root, nodeId)

      if (!node) {
        return
      }

      node.props = {
        ...node.props,
        ...patch,
      } as typeof node.props

      commitDocumentMutation(state, nextSchema, {
        historyGroupId,
        statusMessage: `已更新节点 ${node.id} 的属性`,
      })
    },
    moveExistingNode(
      state,
      action: PayloadAction<{ nodeId: NodeId; targetContainerId: NodeId }>,
    ) {
      const { nodeId, targetContainerId } = action.payload
      const nextSchema = cloneSchema(state.document.currentSchema)
      const moveResult = moveNodeToContainerById(
        nextSchema.root,
        nodeId,
        targetContainerId,
      )

      if (!moveResult) {
        return
      }

      commitDocumentMutation(state, nextSchema, {
        selectedId: moveResult.movedNode.id,
        statusMessage: `已移动 ${moveResult.movedNode.type} 组件`,
      })
    },
    deleteSelectedNode(state) {
      const { selectedId } = state.ui

      if (!selectedId) {
        return
      }

      const nextSchema = cloneSchema(state.document.currentSchema)
      const removed = removeNodeById(nextSchema.root, selectedId)

      if (!removed) {
        return
      }

      commitDocumentMutation(state, nextSchema, {
        selectedId: null,
        statusMessage: `已删除节点 ${selectedId}`,
      })
    },
    duplicateSelectedNode(state) {
      const { selectedId } = state.ui

      if (!selectedId) {
        return
      }

      const nextSchema = cloneSchema(state.document.currentSchema)
      const duplicatedNode = duplicateNodeById(nextSchema.root, selectedId)

      if (!duplicatedNode) {
        return
      }

      commitDocumentMutation(state, nextSchema, {
        selectedId: duplicatedNode.id,
        statusMessage: `已复制 ${duplicatedNode.type} 组件`,
      })
    },
    undoLastChange(state) {
      state.history.activePropertyEditGroup = null
      const previousSchema = state.history.past.pop()

      if (!previousSchema) {
        return
      }

      state.history.future.push(cloneSchema(state.document.currentSchema))
      state.document.currentSchema = cloneSchema(previousSchema)
      updateDirtyFromPublished(state)
      reconcileSelectedNode(state)
      state.ui.saveStatus = state.document.dirty ? 'idle' : state.ui.saveStatus
      state.ui.statusMessage = state.document.dirty ? '已撤销上一步操作' : '已撤销到已保存状态'
    },
    redoLastChange(state) {
      state.history.activePropertyEditGroup = null
      const nextSchema = state.history.future.pop()

      if (!nextSchema) {
        return
      }

      pushUndoSnapshot(state)
      state.document.currentSchema = cloneSchema(nextSchema)
      updateDirtyFromPublished(state)
      reconcileSelectedNode(state)
      state.ui.saveStatus = state.document.dirty ? 'idle' : state.ui.saveStatus
      state.ui.statusMessage = state.document.dirty ? '已重做下一步操作' : '已重做到已保存状态'
    },
    endPropertyEditGesture(state) {
      state.history.activePropertyEditGroup = null
    },
    saveSchemaStarted(state) {
      state.ui.saveStatus = 'loading'
      state.ui.statusMessage = '正在保存 Schema...'
    },
    saveSchemaSucceeded(state, action: PayloadAction<PageSchema>) {
      state.document.publishedSchema = cloneSchema(action.payload)
      updateDirtyFromPublished(state)
      state.ui.saveStatus = 'success'
      state.ui.statusMessage = state.document.dirty
        ? 'Schema 保存成功，但当前已有新的未保存修改'
        : 'Schema 保存成功'
    },
    saveSchemaFailed(state, action: PayloadAction<string>) {
      state.ui.saveStatus = 'error'
      state.ui.statusMessage = action.payload
    },
    loadSchemaStarted(state) {
      state.ui.loadStatus = 'loading'
      state.ui.statusMessage = '正在恢复 Schema...'
    },
    loadSchemaSucceeded(state, action: PayloadAction<PageSchema>) {
      const schema = cloneSchema(action.payload)

      state.document.currentSchema = schema
      state.document.publishedSchema = cloneSchema(action.payload)
      state.document.dirty = false
      state.history.past = []
      state.history.future = []
      state.history.activePropertyEditGroup = null
      state.ui.selectedId = null
      state.ui.loadStatus = 'success'
      state.ui.statusMessage = 'Schema 恢复成功，历史记录已重置'
    },
    loadSchemaFailed(state, action: PayloadAction<string>) {
      state.ui.loadStatus = 'error'
      state.ui.statusMessage = action.payload
    },
    exportSchemaSucceeded(state) {
      state.ui.statusMessage = 'Schema JSON 已导出'
    },
  },
})

export const {
  selectNode,
  addNode,
  reorderNodesInContainer,
  updateNodeProps,
  moveExistingNode,
  deleteSelectedNode,
  duplicateSelectedNode,
  undoLastChange,
  redoLastChange,
  endPropertyEditGesture,
  saveSchemaStarted,
  saveSchemaSucceeded,
  saveSchemaFailed,
  loadSchemaStarted,
  loadSchemaSucceeded,
  loadSchemaFailed,
  exportSchemaSucceeded,
} = editorSlice.actions
export const editorReducer = editorSlice.reducer
