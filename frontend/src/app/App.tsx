import '@/styles/app.css'

const materialItems = ['Banner', 'Text', 'Container']
const propertyFields = [
  { label: '组件类型', value: 'Banner' },
  { label: '标题', value: '夏日营销活动' },
  { label: '描述', value: '这里会在下一阶段接入真实属性表单。' },
]

function App() {
  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div>
          <p className="editor-kicker">Phase 1</p>
          <h1 className="editor-title">低代码编辑器页面骨架</h1>
        </div>

        <div className="editor-toolbar">
          <button type="button" className="toolbar-button">
            保存
          </button>
          <button type="button" className="toolbar-button">
            恢复
          </button>
          <button type="button" className="toolbar-button toolbar-button-primary">
            导出 JSON
          </button>
        </div>
      </header>

      <main className="editor-main">
        <aside className="editor-panel editor-panel-left">
          <div className="panel-header">
            <h2>物料面板</h2>
            <span>3 个基础组件</span>
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
            <span>静态占位，下一步接 schema</span>
          </div>

          <div className="canvas-stage">
            <div className="canvas-page">
              <div className="canvas-banner">Banner 组件占位</div>
              <div className="canvas-text">Text 组件占位</div>
              <div className="canvas-container">Container 组件占位</div>
            </div>
          </div>
        </section>

        <aside className="editor-panel editor-panel-right">
          <div className="panel-header">
            <h2>属性面板</h2>
            <span>当前为静态展示</span>
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
          <span>后续会由 Renderer 根据 schema 渲染</span>
        </div>

        <div className="preview-card">
          <p>这里用于展示页面实时预览效果。</p>
          <p>当前仅用于确认整体布局已经搭好。</p>
        </div>
      </section>
    </div>
  )
}

export default App
