import type { ComponentNode, NodeId, PageSchema } from '@/types/schema'

interface PureRendererProps {
  schema: PageSchema
  selectedId?: NodeId | null
  onNodeClick?: (nodeId: NodeId) => void
}

function renderNode(node: ComponentNode, selectedId?: NodeId | null, onNodeClick?: (nodeId: NodeId) => void) {
  const isSelected = node.id === selectedId
  const selectedClassName = isSelected ? ' canvas-node-selected' : ''

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onNodeClick?.(node.id)
  }

  switch (node.type) {
    case 'banner':
      return (
        <article
          key={node.id}
          className={`canvas-banner canvas-node${selectedClassName}`}
          onClick={handleClick}
        >
          <span className="canvas-node-type">{node.type}</span>
          <strong>{node.props.title}</strong>
          <p>{node.props.description}</p>
        </article>
      )

    case 'text':
      return (
        <article
          key={node.id}
          className={`canvas-text canvas-node${selectedClassName}`}
          onClick={handleClick}
        >
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
          className={`canvas-container canvas-node${selectedClassName}`}
          style={{
            gap: `${node.props.gap}px`,
            padding: `${node.props.padding}px`,
            backgroundColor: node.props.backgroundColor,
          }}
          onClick={handleClick}
        >
          <div className="canvas-container-header">
            <span className="canvas-node-type">{node.type}</span>
            <span>
              {node.props.direction} / {node.children.length} children
            </span>
          </div>

          <div className="canvas-container-children">
            {node.children.map((child) => renderNode(child, selectedId, onNodeClick))}
          </div>
        </article>
      )

    default:
      return null
  }
}

export function PureRenderer({ schema, selectedId = null, onNodeClick }: PureRendererProps) {
  return <>{schema.root.children.map((node) => renderNode(node, selectedId, onNodeClick))}</>
}
