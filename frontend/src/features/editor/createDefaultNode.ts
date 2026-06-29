import { componentRegistry } from '@/features/editor/componentRegistry'
import type {
  ActivityCardNode,
  BannerNode,
  ComponentNode,
  ComponentType,
  ContainerNode,
  FormField,
  FormNode,
  TextNode,
} from '@/types/schema'

function createNodeId(type: ComponentType) {
  return `${type}-${crypto.randomUUID()}`
}

function createFormFieldId(nodeId: string) {
  return `${nodeId}-field-${crypto.randomUUID()}`
}

function createFormFields(nodeId: string, fields: FormField[]) {
  return fields.map((field) => ({
    ...field,
    id: createFormFieldId(nodeId),
  }))
}

export function createDefaultNode(type: 'banner', id?: string): BannerNode
export function createDefaultNode(type: 'text', id?: string): TextNode
export function createDefaultNode(type: 'container', id?: string): ContainerNode
export function createDefaultNode(type: 'form', id?: string): FormNode
export function createDefaultNode(type: 'activity-card', id?: string): ActivityCardNode
export function createDefaultNode(type: ComponentType, id?: string): ComponentNode
export function createDefaultNode(type: ComponentType, id = createNodeId(type)): ComponentNode {
  switch (type) {
    case 'banner':
      return {
        id,
        type,
        props: { ...componentRegistry.banner.defaultProps },
      }

    case 'text':
      return {
        id,
        type,
        props: { ...componentRegistry.text.defaultProps },
      }

    case 'container':
      return {
        id,
        type,
        props: { ...componentRegistry.container.defaultProps },
        children: [],
      }

    case 'form':
      return {
        id,
        type,
        props: {
          ...componentRegistry.form.defaultProps,
          fields: createFormFields(id, componentRegistry.form.defaultProps.fields),
        },
      }

    case 'activity-card':
      return {
        id,
        type,
        props: {
          ...componentRegistry['activity-card'].defaultProps,
          tags: [...componentRegistry['activity-card'].defaultProps.tags],
        },
      }

    default:
      throw new Error(`Unsupported component type: ${type satisfies never}`)
  }
}
