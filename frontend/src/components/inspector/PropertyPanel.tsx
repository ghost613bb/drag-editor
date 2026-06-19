import { componentRegistry } from '@/features/editor/componentRegistry'
import type { ComponentNode, ComponentPropsPatch, NodeId } from '@/types/schema'

interface PropertyPanelProps {
  pageTitle: string
  selectedId: NodeId | null
  selectedNode: ComponentNode | null
  onUpdateSelectedNodeProps: (patch: ComponentPropsPatch) => void
}

function PropertyRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="property-item">
      <label>{label}</label>
      <div className="property-value">{value}</div>
    </div>
  )
}

function renderTypeSpecificFields(
  node: ComponentNode,
  onUpdateSelectedNodeProps: (patch: ComponentPropsPatch) => void,
) {
  switch (node.type) {
    case 'banner':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Banner 属性</h3>
          <div className="property-list">
            <div className="property-item">
              <label htmlFor="banner-title-input">标题</label>
              <input
                id="banner-title-input"
                className="property-input"
                value={node.props.title}
                onChange={(event) => onUpdateSelectedNodeProps({ title: event.target.value })}
              />
            </div>
            <div className="property-item">
              <label htmlFor="banner-description-input">描述</label>
              <textarea
                id="banner-description-input"
                className="property-textarea"
                value={node.props.description}
                onChange={(event) => onUpdateSelectedNodeProps({ description: event.target.value })}
                rows={4}
              />
            </div>
            <div className="property-item">
              <label htmlFor="banner-image-input">图片地址</label>
              <input
                id="banner-image-input"
                className="property-input"
                value={node.props.imageUrl}
                onChange={(event) => onUpdateSelectedNodeProps({ imageUrl: event.target.value })}
              />
            </div>
          </div>
        </div>
      )

    case 'text':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Text 属性</h3>
          <div className="property-list">
            <div className="property-item">
              <label htmlFor="text-content-input">文本内容</label>
              <textarea
                id="text-content-input"
                className="property-textarea"
                value={node.props.content}
                onChange={(event) => onUpdateSelectedNodeProps({ content: event.target.value })}
                rows={4}
              />
            </div>
            <div className="property-item">
              <label htmlFor="text-color-input">颜色</label>
              <input
                id="text-color-input"
                className="property-input"
                value={node.props.color}
                onChange={(event) => onUpdateSelectedNodeProps({ color: event.target.value })}
              />
            </div>
            <div className="property-item">
              <label htmlFor="text-font-size-input">字号</label>
              <input
                id="text-font-size-input"
                className="property-input"
                type="number"
                value={node.props.fontSize}
                onChange={(event) =>
                  onUpdateSelectedNodeProps({ fontSize: Number(event.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>
      )

    case 'container':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Container 属性</h3>
          <div className="property-list">
            <div className="property-item">
              <label htmlFor="container-direction-select">布局方向</label>
              <select
                id="container-direction-select"
                className="property-select"
                value={node.props.direction}
                onChange={(event) =>
                  onUpdateSelectedNodeProps({
                    direction: event.target.value as 'vertical' | 'horizontal',
                  })
                }
              >
                <option value="vertical">vertical</option>
                <option value="horizontal">horizontal</option>
              </select>
            </div>
            <div className="property-item">
              <label htmlFor="container-gap-input">间距</label>
              <input
                id="container-gap-input"
                className="property-input"
                type="number"
                value={node.props.gap}
                onChange={(event) => onUpdateSelectedNodeProps({ gap: Number(event.target.value) || 0 })}
              />
            </div>
            <div className="property-item">
              <label htmlFor="container-padding-input">内边距</label>
              <input
                id="container-padding-input"
                className="property-input"
                type="number"
                value={node.props.padding}
                onChange={(event) =>
                  onUpdateSelectedNodeProps({ padding: Number(event.target.value) || 0 })
                }
              />
            </div>
            <div className="property-item">
              <label htmlFor="container-background-input">背景色</label>
              <input
                id="container-background-input"
                className="property-input"
                value={node.props.backgroundColor}
                onChange={(event) =>
                  onUpdateSelectedNodeProps({ backgroundColor: event.target.value })
                }
              />
            </div>
            <PropertyRow label="子节点数量" value={node.children.length} />
          </div>
        </div>
      )

    default:
      return null
  }
}

export function PropertyPanel({
  pageTitle,
  selectedId,
  selectedNode,
  onUpdateSelectedNodeProps,
}: PropertyPanelProps) {
  if (!selectedNode) {
    return (
      <div className="panel-empty-state">
        <p>当前还没有选中节点。</p>
        <p>点击画布中的 Banner / Text / Container 后，这里会展示对应节点属性。</p>
      </div>
    )
  }

  const registryItem = componentRegistry[selectedNode.type]

  return (
    <div className="property-panel-body">
      <div className="property-group">
        <h3 className="property-group-title">基础信息</h3>
        <div className="property-list">
          <PropertyRow label="页面标题" value={pageTitle} />
          <PropertyRow label="当前节点" value={registryItem.label} />
          <PropertyRow label="节点 ID" value={selectedNode.id} />
          <PropertyRow label="Redux selectedId" value={selectedId ?? '未选中'} />
          <PropertyRow
            label="组件能力"
            value={registryItem.canHaveChildren ? '可承载子节点' : '基础叶子组件'}
          />
        </div>
      </div>

      {renderTypeSpecificFields(selectedNode, onUpdateSelectedNodeProps)}
    </div>
  )
}
