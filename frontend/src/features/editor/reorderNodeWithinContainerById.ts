import type { ComponentNode, ContainerNode, NodeId } from '@/types/schema'

function reorderChildren(
  children: ComponentNode[],
  activeId: NodeId,
  overId: NodeId,
): ComponentNode | null {
  const activeIndex = children.findIndex((child) => child.id === activeId)
  const overIndex = children.findIndex((child) => child.id === overId)

  if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
    return null
  }

  const [movedNode] = children.splice(activeIndex, 1)
  children.splice(overIndex, 0, movedNode)

  return movedNode
}

function reorderInChildren(
  children: ComponentNode[],
  containerId: NodeId,
  activeId: NodeId,
  overId: NodeId,
): ComponentNode | null {
  for (const child of children) {
    if (child.type !== 'container') {
      continue
    }

    if (child.id === containerId) {
      return reorderChildren(child.children, activeId, overId)
    }

    const movedNode = reorderInChildren(child.children, containerId, activeId, overId)

    if (movedNode) {
      return movedNode
    }
  }

  return null
}

export function reorderNodeWithinContainerById(
  root: ContainerNode,
  containerId: NodeId,
  activeId: NodeId,
  overId: NodeId,
): ComponentNode | null {
  if (root.id === containerId) {
    return reorderChildren(root.children, activeId, overId)
  }

  return reorderInChildren(root.children, containerId, activeId, overId)
}
