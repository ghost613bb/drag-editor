import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { findNodeById } from '@/features/editor/findNodeById'
import { mockPageSchema } from '@/features/editor/mockSchema'
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
    addNode(state, action: PayloadAction<{ node: ComponentNode }>) {
      const { node } = action.payload

      state.document.currentSchema.root.children.push(node)
      state.document.dirty = true
      state.ui.selectedId = node.id
      state.ui.statusMessage = `已新增 ${node.type} 组件`
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
  },
})

export const { selectNode, addNode, updateNodeProps } = editorSlice.actions
export const editorReducer = editorSlice.reducer
