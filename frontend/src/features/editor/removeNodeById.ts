import type { ComponentNode, ContainerNode, NodeId } from '@/types/schema'

function removeFromChildren(children: ComponentNode[], targetId: NodeId): boolean {
  const childIndex = children.findIndex((child) => child.id === targetId)

  if (childIndex >= 0) {
    children.splice(childIndex, 1)
    return true
  }

  for (const child of children) {
    if (child.type === 'container') {
      const removed = removeNodeById(child, targetId)

      if (removed) {
        return true
      }
    }
  }

  return false
}

export function removeNodeById(root: ContainerNode, targetId: NodeId): boolean {
  return removeFromChildren(root.children, targetId)
}
