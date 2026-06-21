import { insertNodeIntoContainerById } from '@/features/editor/insertNodeIntoContainerById'
import type { ComponentNode, ContainerNode, NodeId } from '@/types/schema'

interface MoveNodeResult {
  movedNode: ComponentNode
}

function extractNodeFromChildren(children: ComponentNode[], targetId: NodeId): ComponentNode | null {
  const childIndex = children.findIndex((child) => child.id === targetId)

  if (childIndex >= 0) {
    const [extractedNode] = children.splice(childIndex, 1)
    return extractedNode ?? null
  }

  for (const child of children) {
    if (child.type !== 'container') {
      continue
    }

    const extractedNode = extractNodeFromChildren(child.children, targetId)

    if (extractedNode) {
      return extractedNode
    }
  }

  return null
}

function containsNodeId(node: ComponentNode, targetId: NodeId): boolean {
  if (node.id === targetId) {
    return true
  }

  if (node.type !== 'container') {
    return false
  }

  return node.children.some((child) => containsNodeId(child, targetId))
}

function findNodeById(root: ContainerNode, targetId: NodeId): ComponentNode | null {
  if (root.id === targetId) {
    return root
  }

  return extractPreviewNode(root.children, targetId)
}

function extractPreviewNode(children: ComponentNode[], targetId: NodeId): ComponentNode | null {
  for (const child of children) {
    if (child.id === targetId) {
      return child
    }

    if (child.type === 'container') {
      const nestedNode = extractPreviewNode(child.children, targetId)

      if (nestedNode) {
        return nestedNode
      }
    }
  }

  return null
}

export function moveNodeToContainerById(
  root: ContainerNode,
  nodeId: NodeId,
  targetContainerId: NodeId,
): MoveNodeResult | null {
  if (root.id === nodeId) {
    return null
  }

  const movingNode = findNodeById(root, nodeId)

  if (!movingNode) {
    return null
  }

  if (movingNode.id === targetContainerId) {
    return null
  }

  if (movingNode.type === 'container' && containsNodeId(movingNode, targetContainerId)) {
    return null
  }

  const extractedNode = extractNodeFromChildren(root.children, nodeId)

  if (!extractedNode) {
    return null
  }

  const insertedNode = insertNodeIntoContainerById(root, targetContainerId, extractedNode)

  if (!insertedNode) {
    insertNodeIntoContainerById(root, root.id, extractedNode)
    return null
  }

  return { movedNode: insertedNode }
}
