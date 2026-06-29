import { componentRegistry } from '@/features/editor/componentRegistry'
import type { ComponentNode, ContainerNode, NodeId } from '@/types/schema'

function createClonedNodeId(type: ComponentNode['type']) {
  return `${type}-${crypto.randomUUID()}`
}

function cloneNodeWithFreshIds(node: ComponentNode): ComponentNode {
  const id = createClonedNodeId(node.type)
  const registryItem = componentRegistry[node.type] as {
    cloneProps: (props: typeof node.props, nextNodeId: NodeId) => typeof node.props
  }
  const props = registryItem.cloneProps(node.props, id)

  if (node.type === 'container') {
    return {
      id,
      type: node.type,
      props,
      children: node.children.map(cloneNodeWithFreshIds),
    } as ContainerNode
  }

  return {
    id,
    type: node.type,
    props,
  } as ComponentNode
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
