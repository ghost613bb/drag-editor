import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ComponentNode, NodeId, PageSchema } from '@/types/schema'

interface PureRendererProps {
  schema: PageSchema
  selectedId?: NodeId | null
  onNodeClick?: (nodeId: NodeId) => void
}

interface SortableNodeRendererProps {
  node: ComponentNode
  selectedId?: NodeId | null
  onNodeClick?: (nodeId: NodeId) => void
}

function SortableNodeRenderer({ node, selectedId, onNodeClick }: SortableNodeRendererProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
  })
  const isSelected = node.id === selectedId
  const selectedClassName = isSelected ? ' canvas-node-selected' : ''

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onNodeClick?.(node.id)
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const dragHandle = {
    ...attributes,
    ...listeners,
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      event.stopPropagation()
      listeners?.onPointerDown?.(event)
    },
  }

  switch (node.type) {
    case 'banner':
      return (
        <article
          ref={setNodeRef}
          key={node.id}
          style={style}
          className={`canvas-banner canvas-node${selectedClassName}`}
          onClick={handleClick}
          {...dragHandle}
        >
          <span className="canvas-node-type">{node.type}</span>
          <strong>{node.props.title}</strong>
          <p>{node.props.description}</p>
          <p className="canvas-banner-image-url">image: {node.props.imageUrl}</p>
        </article>
      )

    case 'text':
      return (
        <article
          ref={setNodeRef}
          key={node.id}
          style={style}
          className={`canvas-text canvas-node${selectedClassName}`}
          onClick={handleClick}
          {...dragHandle}
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
          ref={setNodeRef}
          key={node.id}
          style={{
            ...style,
            gap: `${node.props.gap}px`,
            padding: `${node.props.padding}px`,
            backgroundColor: node.props.backgroundColor,
          }}
          className={`canvas-container canvas-node${selectedClassName}`}
          onClick={handleClick}
          {...dragHandle}
        >
          <div className="canvas-container-header">
            <span className="canvas-node-type">{node.type}</span>
            <span>
              {node.props.direction} / {node.children.length} children
            </span>
          </div>

          <div
            className={`canvas-container-children canvas-container-children-${node.props.direction}`}
            style={{
              gap: `${node.props.gap}px`,
            }}
          >
            {node.children.map((child) => (
              <StaticNodeRenderer key={child.id} node={child} selectedId={selectedId} onNodeClick={onNodeClick} />
            ))}
          </div>
        </article>
      )

    default:
      return null
  }
}

function StaticNodeRenderer({ node, selectedId, onNodeClick }: SortableNodeRendererProps) {
  const isSelected = node.id === selectedId
  const selectedClassName = isSelected ? ' canvas-node-selected' : ''

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onNodeClick?.(node.id)
  }

  switch (node.type) {
    case 'banner':
      return (
        <article key={node.id} className={`canvas-banner canvas-node${selectedClassName}`} onClick={handleClick}>
          <span className="canvas-node-type">{node.type}</span>
          <strong>{node.props.title}</strong>
          <p>{node.props.description}</p>
          <p className="canvas-banner-image-url">image: {node.props.imageUrl}</p>
        </article>
      )

    case 'text':
      return (
        <article key={node.id} className={`canvas-text canvas-node${selectedClassName}`} onClick={handleClick}>
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

          <div
            className={`canvas-container-children canvas-container-children-${node.props.direction}`}
            style={{
              gap: `${node.props.gap}px`,
            }}
          >
            {node.children.map((child) => (
              <StaticNodeRenderer key={child.id} node={child} selectedId={selectedId} onNodeClick={onNodeClick} />
            ))}
          </div>
        </article>
      )

    default:
      return null
  }
}

export function PureRenderer({ schema, selectedId = null, onNodeClick }: PureRendererProps) {
  const rootNodeIds = schema.root.children.map((node) => node.id)

  return (
    <SortableContext items={rootNodeIds} strategy={verticalListSortingStrategy}>
      {schema.root.children.map((node) => (
        <SortableNodeRenderer
          key={node.id}
          node={node}
          selectedId={selectedId}
          onNodeClick={onNodeClick}
        />
      ))}
    </SortableContext>
  )
}
