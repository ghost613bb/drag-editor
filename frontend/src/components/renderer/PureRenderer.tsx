import { useDroppable } from '@dnd-kit/core'
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
  containerId: NodeId
  level: 'root' | 'nested'
  selectedId?: NodeId | null
  onNodeClick?: (nodeId: NodeId) => void
}

function ChildrenDropZone({
  containerId,
  level,
  className,
  style,
  children,
}: {
  containerId: NodeId
  level: 'root' | 'nested'
  className: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `children:${containerId}`,
    data: {
      kind: 'container-children-drop-zone',
      containerId,
      level,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'canvas-children-drop-active' : ''}`}
      style={style}
    >
      {children}
    </div>
  )
}

function SortableNodeRenderer({
  node,
  containerId,
  level,
  selectedId,
  onNodeClick,
}: SortableNodeRendererProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
    data: {
      kind: 'canvas-node',
      nodeId: node.id,
      containerId,
      level,
    },
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

    case 'form':
      return (
        <article
          ref={setNodeRef}
          key={node.id}
          style={style}
          className={`canvas-form canvas-node${selectedClassName}`}
          onClick={handleClick}
          {...dragHandle}
        >
          <span className="canvas-node-type">{node.type}</span>
          <strong className="canvas-form-title">{node.props.title}</strong>
          <div className="canvas-form-fields">
            {node.props.fields.map((field) => (
              <div className="canvas-form-field" key={field.id}>
                <div className="canvas-form-field-label">
                  <span>{field.label}</span>
                  {field.required ? <span className="canvas-form-required">必填</span> : null}
                </div>
                <div className="canvas-form-field-placeholder">
                  {field.placeholder || (field.type === 'phone' ? '请输入手机号' : '请输入内容')}
                </div>
              </div>
            ))}
          </div>
          <button className="canvas-form-button" type="button" tabIndex={-1}>
            {node.props.buttonText}
          </button>
        </article>
      )

    case 'activity-card':
      return (
        <article
          ref={setNodeRef}
          key={node.id}
          style={style}
          className={`canvas-activity-card canvas-node${selectedClassName}`}
          onClick={handleClick}
          {...dragHandle}
        >
          <span className="canvas-node-type">{node.type}</span>
          <div>
            <strong className="canvas-activity-card-title">{node.props.title}</strong>
            <p className="canvas-activity-card-subtitle">{node.props.subtitle}</p>
          </div>
          <p className="canvas-activity-card-price">{node.props.price}</p>
          <div className="canvas-activity-card-tags">
            {node.props.tags.map((tag, index) => (
              <span className="canvas-activity-card-tag" key={`${tag}-${index}`}>
                {tag}
              </span>
            ))}
          </div>
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

          <ChildrenDropZone
            containerId={node.id}
            level="nested"
            className={`canvas-container-children canvas-container-children-${node.props.direction}`}
            style={{
              gap: `${node.props.gap}px`,
            }}
          >
            <SortableContext
              items={node.children.map((child) => child.id)}
              strategy={verticalListSortingStrategy}
            >
              {node.children.map((child) => (
                <SortableNodeRenderer
                  key={child.id}
                  node={child}
                  containerId={node.id}
                  level="nested"
                  selectedId={selectedId}
                  onNodeClick={onNodeClick}
                />
              ))}
            </SortableContext>
          </ChildrenDropZone>
        </article>
      )

    default:
      return null
  }
}

export function PureRenderer({ schema, selectedId = null, onNodeClick }: PureRendererProps) {
  const rootNodeIds = schema.root.children.map((node) => node.id)

  return (
    <ChildrenDropZone
      containerId={schema.root.id}
      level="root"
      className="canvas-root-children"
    >
      <SortableContext items={rootNodeIds} strategy={verticalListSortingStrategy}>
        {schema.root.children.map((node) => (
          <SortableNodeRenderer
            key={node.id}
            node={node}
            containerId={schema.root.id}
            level="root"
            selectedId={selectedId}
            onNodeClick={onNodeClick}
          />
        ))}
      </SortableContext>
    </ChildrenDropZone>
  )
}
