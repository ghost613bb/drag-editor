import { useState } from 'react'
import { PureRenderer } from '@/components/renderer/PureRenderer'
import { componentRegistry } from '@/features/editor/componentRegistry'
import { createDefaultNode } from '@/features/editor/createDefaultNode'
import { mockPageSchema } from '@/features/editor/mockSchema'
import type { ComponentNode, ComponentType } from '@/types/schema'
import '@/styles/app.css'

function App() {
  const materialItems = Object.values(componentRegistry)
  const selectedNode = mockPageSchema.root.children[0]
  const [draftNode, setDraftNode] = useState<ComponentNode | null>(null)

  const inspectorNode = draftNode ?? selectedNode
  const propertyFields = [
    { label: '页面标题', value: mockPageSchema.pageMeta.title },
    { label: '数据来源', value: draftNode ? 'createDefaultNode' : 'mock schema' },
    { label: '当前节点', value: componentRegistry[inspectorNode.type].label },
    { label: '节点 ID', value: inspectorNode.id },
    {
      label: '组件能力',
      value: componentRegistry[inspectorNode.type].canHaveChildren ? '可承载子节点' : '基础叶子组件',
    },
  ]

  const handleCreateDraftNode = (type: ComponentType) => {
    setDraftNode(createDefaultNode(type))
  }

  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div>
          <p className="editor-kicker">Phase 3</p>
          <h1 className="editor-title">低代码编辑器页面骨架</h1>
        </div>

        <div className="editor-toolbar">
          <button type="button" className="toolbar-button">
            保存
          </button>
          <button type="button" className="toolbar-button">
            恢复
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
            <span>{mockPageSchema.pageMeta.title}</span>
          </div>

          <div className="canvas-stage">
            <div className="canvas-page">
              <PureRenderer schema={mockPageSchema} />
            </div>
          </div>
        </section>

        <aside className="editor-panel editor-panel-right">
          <div className="panel-header">
            <h2>属性面板</h2>
            <span>{draftNode ? '当前展示默认节点草稿' : '当前读取 mock schema'}</span>
          </div>

          <div className="property-list">
            {propertyFields.map((field) => (
              <div key={field.label} className="property-item">
                <label>{field.label}</label>
                <div className="property-value">{field.value}</div>
              </div>
            ))}
          </div>
        </aside>
      </main>

      <section className="editor-preview editor-panel">
        <div className="panel-header">
          <h2>预览面板</h2>
          <span>{draftNode ? '当前展示新建默认节点结果' : '当前展示 schema 摘要'}</span>
        </div>

        <div className="preview-card">
          {draftNode ? (
            <pre className="preview-code">{JSON.stringify(draftNode, null, 2)}</pre>
          ) : (
            <>
              <p>schema version: {mockPageSchema.version}</p>
              <p>root children: {mockPageSchema.root.children.length}</p>
              <p>{mockPageSchema.pageMeta.description}</p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
