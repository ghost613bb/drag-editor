import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ComponentType } from '@/types/schema'

interface MaterialPaletteItemProps {
  type: ComponentType
  label: string
  description: string
  active: boolean
  onInsert: (type: ComponentType) => void
}

export function MaterialPaletteItem({
  type,
  label,
  description,
  active,
  onInsert,
}: MaterialPaletteItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `material-${type}`,
    data: {
      kind: 'material',
      componentType: type,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.65 : 1,
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      className={`material-card ${active ? 'material-card-active' : ''} ${isDragging ? 'material-card-dragging' : ''}`}
      onClick={() => onInsert(type)}
      {...attributes}
      {...listeners}
    >
      <strong>{label}</strong>
      <span>{description}</span>
    </button>
  )
}
