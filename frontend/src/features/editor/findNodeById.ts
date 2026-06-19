import type { ComponentNode, ContainerNode, NodeId } from '@/types/schema'

function findInChildren(children: ComponentNode[], targetId: NodeId): ComponentNode | null {
  for (const child of children) {
    if (child.id === targetId) {
      return child
    }

    if (child.type === 'container') {
      const nestedNode = findNodeById(child, targetId)

      if (nestedNode) {
        return nestedNode
      }
    }
  }

  return null
}

export function findNodeById(root: ContainerNode, targetId: NodeId): ComponentNode | null {
  if (root.id === targetId) {
    return root
  }

  return findInChildren(root.children, targetId)
}
