import type { ChangeEvent } from 'react'
import { componentRegistry } from '@/features/editor/componentRegistry'
import type { ComponentNode, NodeId } from '@/types/schema'

interface PropertyPanelProps {
  pageTitle: string
  selectedId: NodeId | null
  selectedNode: ComponentNode | null
  onTextContentChange: (value: string) => void
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
  onTextContentChange: (value: string) => void,
) {
  switch (node.type) {
    case 'banner':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Banner 属性</h3>
          <div className="property-list">
            <PropertyRow label="标题" value={node.props.title} />
            <PropertyRow label="描述" value={node.props.description} />
            <PropertyRow label="图片地址" value={node.props.imageUrl} />
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
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onTextContentChange(event.target.value)}
                rows={4}
              />
            </div>
            <PropertyRow label="颜色" value={node.props.color} />
            <PropertyRow label="字号" value={`${node.props.fontSize}px`} />
          </div>
        </div>
      )

    case 'container':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Container 属性</h3>
          <div className="property-list">
            <PropertyRow label="布局方向" value={node.props.direction} />
            <PropertyRow label="间距" value={`${node.props.gap}px`} />
            <PropertyRow label="内边距" value={`${node.props.padding}px`} />
            <PropertyRow label="背景色" value={node.props.backgroundColor} />
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
  onTextContentChange,
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

      {renderTypeSpecificFields(selectedNode, onTextContentChange)}
    </div>
  )
}
