import type { ComponentNode, ContainerNode, NodeId } from '@/types/schema'

function insertIntoChildren(
  children: ComponentNode[],
  containerId: NodeId,
  node: ComponentNode,
): ComponentNode | null {
  for (const child of children) {
    if (child.type !== 'container') {
      continue
    }

    if (child.id === containerId) {
      child.children.push(node)
      return node
    }

    const insertedNode = insertIntoChildren(child.children, containerId, node)

    if (insertedNode) {
      return insertedNode
    }
  }

  return null
}

export function insertNodeIntoContainerById(
  root: ContainerNode,
  containerId: NodeId,
  node: ComponentNode,
): ComponentNode | null {
  if (root.id === containerId) {
    root.children.push(node)
    return node
  }

  return insertIntoChildren(root.children, containerId, node)
}
