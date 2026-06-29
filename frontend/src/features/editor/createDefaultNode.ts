import { componentRegistry } from '@/features/editor/componentRegistry'
import type {
  ActivityCardNode,
  BannerNode,
  ComponentNode,
  ComponentType,
  ContainerNode,
  FormNode,
  TextNode,
} from '@/types/schema'

function createNodeId(type: ComponentType) {
  return `${type}-${crypto.randomUUID()}`
}

export function createDefaultNode(type: 'banner', id?: string): BannerNode
export function createDefaultNode(type: 'text', id?: string): TextNode
export function createDefaultNode(type: 'container', id?: string): ContainerNode
export function createDefaultNode(type: 'form', id?: string): FormNode
export function createDefaultNode(type: 'activity-card', id?: string): ActivityCardNode
export function createDefaultNode(type: ComponentType, id?: string): ComponentNode
export function createDefaultNode(type: ComponentType, id = createNodeId(type)): ComponentNode {
  const registryItem = componentRegistry[type]
  const props = registryItem.createDefaultProps(id)

  if (type === 'container') {
    return {
      id,
      type,
      props,
      children: [],
    } as ContainerNode
  }

  return {
    id,
    type,
    props,
  } as ComponentNode
}
