import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PropertyPanel } from '@/components/inspector/PropertyPanel'
import { PureRenderer } from '@/components/renderer/PureRenderer'
import type { AppDispatch, RootState } from '@/app/store'
import { componentRegistry } from '@/features/editor/componentRegistry'
import {
  addNode,
  deleteSelectedNode,
  duplicateSelectedNode,
  selectNode,
  updateNodeProps,
} from '@/features/editor/editorSlice'
import { createDefaultNode } from '@/features/editor/createDefaultNode'
import { findNodeById } from '@/features/editor/findNodeById'
import type { ComponentNode, ComponentPropsPatch, ComponentType } from '@/types/schema'
import '@/styles/app.css'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const materialItems = Object.values(componentRegistry)
  const currentSchema = useSelector((state: RootState) => state.editor.document.currentSchema)
  const selectedId = useSelector((state: RootState) => state.editor.ui.selectedId)
  const [draftNode, setDraftNode] = useState<ComponentNode | null>(null)

  const selectedNode = selectedId ? findNodeById(currentSchema.root, selectedId) : null

  const handleCreateDraftNode = (type: ComponentType) => {
    const nextDraftNode = createDefaultNode(type)

    setDraftNode(nextDraftNode)
    dispatch(addNode({ node: nextDraftNode }))
  }

  const handleSelectNode = (nodeId: string) => {
    dispatch(selectNode(nodeId))
  }

  const handleUpdateSelectedNodeProps = (patch: ComponentPropsPatch) => {
    if (!selectedNode) {
      return
    }

    dispatch(
      updateNodeProps({
        nodeId: selectedNode.id,
        patch,
      }),
    )
  }

  const handleDeleteSelectedNode = () => {
    if (!selectedNode) {
      return
    }

    dispatch(deleteSelectedNode())
  }

  const handleDuplicateSelectedNode = () => {
    if (!selectedNode) {
      return
    }

    dispatch(duplicateSelectedNode())
  }

  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div>
          <p className="editor-kicker">Phase 5</p>
          <h1 className="editor-title">低代码编辑器页面骨架</h1>
        </div>

        <div className="editor-toolbar">
          <button type="button" className="toolbar-button">
            保存
          </button>
          <button type="button" className="toolbar-button">
            恢复
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={handleDuplicateSelectedNode}
            disabled={!selectedNode}
          >
            复制当前节点
          </button>
          <button
            type="button"
            className="toolbar-button toolbar-button-danger"
            onClick={handleDeleteSelectedNode}
            disabled={!selectedNode}
          >
            删除当前节点
          </button>
          <button type="button" className="toolbar-button toolbar-button-primary toolbar-button-export">
            <span className="toolbar-button-label">导出</span>
            <span className="toolbar-button-token">JSON</span>
          </button>
        </div>
      </header>

      <main className="editor-main">
        <aside className="editor-panel editor-panel-left">
          <div className="panel-header">
            <h2>物料面板</h2>
            <span>{materialItems.length} 个基础组件</span>
          </div>

          <div className="material-list">
            {materialItems.map((item) => (
              <button
                key={item.type}
                type="button"
                className={`material-card ${draftNode?.type === item.type ? 'material-card-active' : ''}`}
                onClick={() => handleCreateDraftNode(item.type)}
              >
                <strong>{item.label}</strong>
                <span>
                  {item.canHaveChildren ? '可承载子节点' : '基础叶子组件'} / type: {item.type}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="editor-panel editor-panel-center">
          <div className="panel-header">
            <h2>画布区域</h2>
            <span>{currentSchema.pageMeta.title}</span>
          </div>

          <div className="canvas-stage">
            <div className="canvas-page">
              <PureRenderer
                schema={currentSchema}
                selectedId={selectedId}
                onNodeClick={handleSelectNode}
              />
            </div>
          </div>
        </section>

        <aside className="editor-panel editor-panel-right">
          <div className="panel-header">
            <h2>属性面板</h2>
            <span>{selectedNode ? '支持最小属性编辑闭环' : '点击画布节点查看属性'}</span>
          </div>

          <PropertyPanel
            pageTitle={currentSchema.pageMeta.title}
            selectedId={selectedId}
            selectedNode={selectedNode}
            onUpdateSelectedNodeProps={handleUpdateSelectedNodeProps}
          />
        </aside>
      </main>

      <section className="editor-preview editor-panel">
        <div className="panel-header">
          <h2>预览面板</h2>
          <span>{draftNode ? '当前展示新建默认节点结果' : '当前展示 Redux schema 摘要'}</span>
        </div>

        <div className="preview-card">
          {draftNode ? (
            <pre className="preview-code">{JSON.stringify(draftNode, null, 2)}</pre>
          ) : (
            <>
              <p>schema version: {currentSchema.version}</p>
              <p>root children: {currentSchema.root.children.length}</p>
              <p>{currentSchema.pageMeta.description}</p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
