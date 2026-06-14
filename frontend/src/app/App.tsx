import { mockPageSchema } from '@/features/editor/mockSchema'
import type { ComponentNode } from '@/types/schema'
import '@/styles/app.css'

const materialItems = ['Banner', 'Text', 'Container']

function renderCanvasNode(node: ComponentNode) {
  switch (node.type) {
    case 'banner':
      return (
        <article key={node.id} className="canvas-banner">
          <span className="canvas-node-type">{node.type}</span>
          <strong>{node.props.title}</strong>
          <p>{node.props.description}</p>
        </article>
      )

    case 'text':
      return (
        <article key={node.id} className="canvas-text">
          <span className="canvas-node-type">{node.type}</span>
          <p style={{ color: node.props.color, fontSize: `${node.props.fontSize}px` }}>
            {node.props.content}
          </p>
        </article>
      )

    case 'container':
      return (
        <article
          key={node.id}
          className="canvas-container"
          style={{
            gap: `${node.props.gap}px`,
            padding: `${node.props.padding}px`,
            backgroundColor: node.props.backgroundColor,
          }}
        >
          <div className="canvas-container-header">
            <span className="canvas-node-type">{node.type}</span>
            <span>
              {node.props.direction} / {node.children.length} children
            </span>
          </div>

          <div className="canvas-container-children">{node.children.map(renderCanvasNode)}</div>
        </article>
      )

    default:
      return null
  }
}

function App() {
  const selectedNode = mockPageSchema.root.children[0]
  const propertyFields = [
    { label: '页面标题', value: mockPageSchema.pageMeta.title },
    { label: '当前示例节点', value: selectedNode.type },
    { label: '节点 ID', value: selectedNode.id },
  ]

  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div>
          <p className="editor-kicker">Phase 2</p>
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
              <button key={item} type="button" className="material-card">
                <strong>{item}</strong>
                <span>后续接入 registry / 拖拽</span>
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
            <div className="canvas-page">{mockPageSchema.root.children.map(renderCanvasNode)}</div>
          </div>
        </section>

        <aside className="editor-panel editor-panel-right">
          <div className="panel-header">
            <h2>属性面板</h2>
            <span>当前读取 mock schema</span>
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
          <span>当前展示 schema 摘要</span>
        </div>

        <div className="preview-card">
          <p>schema version: {mockPageSchema.version}</p>
          <p>root children: {mockPageSchema.root.children.length}</p>
          <p>{mockPageSchema.pageMeta.description}</p>
        </div>
      </section>
    </div>
  )
}

export default App
