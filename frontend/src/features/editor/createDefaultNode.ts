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

    default:
      throw new Error(`Unsupported component type: ${type satisfies never}`)
  }
}
