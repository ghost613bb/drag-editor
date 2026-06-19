import type {
  BannerNode,
  ComponentNode,
  ContainerNode,
  NodeId,
  TextNode,
} from '@/types/schema'

function createClonedNodeId(type: ComponentNode['type']) {
  return `${type}-${crypto.randomUUID()}`
}

function cloneBannerNode(node: BannerNode): BannerNode {
  return {
    id: createClonedNodeId(node.type),
    type: node.type,
    props: { ...node.props },
  }
}

function cloneTextNode(node: TextNode): TextNode {
  return {
    id: createClonedNodeId(node.type),
    type: node.type,
    props: { ...node.props },
  }
}

function cloneContainerNode(node: ContainerNode): ContainerNode {
  return {
    id: createClonedNodeId(node.type),
    type: node.type,
    props: { ...node.props },
    children: node.children.map(cloneNodeWithFreshIds),
  }
}

function cloneNodeWithFreshIds(node: ComponentNode): ComponentNode {
  switch (node.type) {
    case 'banner':
      return cloneBannerNode(node)
    case 'text':
      return cloneTextNode(node)
    case 'container':
      return cloneContainerNode(node)
    default:
      throw new Error(`Unsupported component type: ${node satisfies never}`)
  }
}

function duplicateInChildren(children: ComponentNode[], targetId: NodeId): ComponentNode | null {
  for (const [index, child] of children.entries()) {
    if (child.id === targetId) {
      const duplicatedNode = cloneNodeWithFreshIds(child)

      children.splice(index + 1, 0, duplicatedNode)
      return duplicatedNode
    }

    if (child.type === 'container') {
      const duplicatedNode = duplicateInChildren(child.children, targetId)

      if (duplicatedNode) {
        return duplicatedNode
      }
    }
  }

  return null
}

export function duplicateNodeById(root: ContainerNode, targetId: NodeId): ComponentNode | null {
  return duplicateInChildren(root.children, targetId)
}
