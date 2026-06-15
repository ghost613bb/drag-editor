import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mockPageSchema } from '@/features/editor/mockSchema'
import type { EditorState, NodeId } from '@/types/schema'

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
  },
})

export const { selectNode } = editorSlice.actions
export const editorReducer = editorSlice.reducer
