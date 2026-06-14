import type { ComponentNode, PageSchema } from '@/types/schema'

interface PureRendererProps {
  schema: PageSchema
}

function renderNode(node: ComponentNode) {
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

          <div className="canvas-container-children">{node.children.map(renderNode)}</div>
        </article>
      )

    default:
      return null
  }
}

export function PureRenderer({ schema }: PureRendererProps) {
  return <>{schema.root.children.map(renderNode)}</>
}
