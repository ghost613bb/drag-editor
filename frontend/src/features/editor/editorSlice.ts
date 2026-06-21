import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { duplicateNodeById } from '@/features/editor/duplicateNodeById'
import { findNodeById } from '@/features/editor/findNodeById'
import { insertNodeIntoContainerById } from '@/features/editor/insertNodeIntoContainerById'
import { mockPageSchema } from '@/features/editor/mockSchema'
import { moveNodeToContainerById } from '@/features/editor/moveNodeToContainerById'
import { removeNodeById } from '@/features/editor/removeNodeById'
import { reorderNodeWithinContainerById } from '@/features/editor/reorderNodeWithinContainerById'
import type { ComponentNode, ComponentPropsPatch, EditorState, NodeId } from '@/types/schema'

const initialState: EditorState = {
  document: {
    currentSchema: mockPageSchema,
    publishedSchema: mockPageSchema,
    dirty: false,
  },
  ui: {
    selectedId: null,
    hoveredId: null,
    saveStatus: 'idle',
    loadStatus: 'idle',
    statusMessage: '编辑器已初始化',
  },
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    selectNode(state, action: PayloadAction<NodeId | null>) {
      state.ui.selectedId = action.payload
    },
    addNode(state, action: PayloadAction<{ node: ComponentNode; containerId?: NodeId }>) {
      const { node, containerId = state.document.currentSchema.root.id } = action.payload
      const insertedNode = insertNodeIntoContainerById(
        state.document.currentSchema.root,
        containerId,
        node,
      )

      if (!insertedNode) {
        return
      }

      state.document.dirty = true
      state.ui.selectedId = insertedNode.id
      state.ui.statusMessage = `已新增 ${insertedNode.type} 组件`
    },
    reorderNodesInContainer(
      state,
      action: PayloadAction<{ containerId: NodeId; activeId: NodeId; overId: NodeId }>,
    ) {
      const { containerId, activeId, overId } = action.payload
      const movedNode = reorderNodeWithinContainerById(
        state.document.currentSchema.root,
        containerId,
        activeId,
        overId,
      )

      if (!movedNode) {
        return
      }

      state.document.dirty = true
      state.ui.statusMessage = `已调整 ${movedNode.type} 组件顺序`
    },
    updateNodeProps(state, action: PayloadAction<{ nodeId: NodeId; patch: ComponentPropsPatch }>) {
      const { nodeId, patch } = action.payload
      const node = findNodeById(state.document.currentSchema.root, nodeId)

      if (!node) {
        return
      }

      node.props = {
        ...node.props,
        ...patch,
      } as typeof node.props
      state.document.dirty = true
      state.ui.statusMessage = `已更新节点 ${node.id} 的属性`
    },
    moveExistingNode(
      state,
      action: PayloadAction<{ nodeId: NodeId; targetContainerId: NodeId }>,
    ) {
      const { nodeId, targetContainerId } = action.payload
      const moveResult = moveNodeToContainerById(
        state.document.currentSchema.root,
        nodeId,
        targetContainerId,
      )

      if (!moveResult) {
        return
      }

      state.document.dirty = true
      state.ui.selectedId = moveResult.movedNode.id
      state.ui.statusMessage = `已移动 ${moveResult.movedNode.type} 组件`
    },
    deleteSelectedNode(state) {
      const { selectedId } = state.ui

      if (!selectedId) {
        return
      }

      const removed = removeNodeById(state.document.currentSchema.root, selectedId)

      if (!removed) {
        return
      }

      state.document.dirty = true
      state.ui.selectedId = null
      state.ui.statusMessage = `已删除节点 ${selectedId}`
    },
    duplicateSelectedNode(state) {
      const { selectedId } = state.ui

      if (!selectedId) {
        return
      }

      const duplicatedNode = duplicateNodeById(state.document.currentSchema.root, selectedId)

      if (!duplicatedNode) {
        return
      }

      state.document.dirty = true
      state.ui.selectedId = duplicatedNode.id
      state.ui.statusMessage = `已复制 ${duplicatedNode.type} 组件`
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
} = editorSlice.actions
export const editorReducer = editorSlice.reducer
