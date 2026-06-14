import { componentRegistry } from '@/features/editor/componentRegistry'
import type {
  BannerNode,
  ComponentNode,
  ComponentType,
  ContainerNode,
  TextNode,
} from '@/types/schema'

function createNodeId(type: ComponentType) {
  return `${type}-${crypto.randomUUID()}`
}

export function createDefaultNode(type: 'banner', id?: string): BannerNode
export function createDefaultNode(type: 'text', id?: string): TextNode
export function createDefaultNode(type: 'container', id?: string): ContainerNode
export function createDefaultNode(type: ComponentType, id = createNodeId(type)): ComponentNode {
  const registryItem = componentRegistry[type]

  if (type === 'container') {
    return {
      id,
      type,
      props: { ...registryItem.defaultProps },
      children: [],
    }
  }

  return {
    id,
    type,
    props: { ...registryItem.defaultProps },
  }
}
