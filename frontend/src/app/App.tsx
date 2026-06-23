import { useState } from 'react'
import {
  closestCenter,
  type CollisionDetection,
  type DragEndEvent,
  DndContext,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useDispatch, useSelector } from 'react-redux'
import { PropertyPanel } from '@/components/inspector/PropertyPanel'
import { MaterialPaletteItem } from '@/components/materials/MaterialPaletteItem'
import { PureRenderer } from '@/components/renderer/PureRenderer'
import type { AppDispatch, RootState } from '@/app/store'
import { componentRegistry } from '@/features/editor/componentRegistry'
import { createDefaultNode } from '@/features/editor/createDefaultNode'
import {
  addNode,
  deleteSelectedNode,
  duplicateSelectedNode,
  exportSchemaSucceeded,
  loadSchemaFailed,
  loadSchemaStarted,
  loadSchemaSucceeded,
  moveExistingNode,
  reorderNodesInContainer,
  saveSchemaFailed,
  saveSchemaStarted,
  saveSchemaSucceeded,
  selectNode,
  updateNodeProps,
} from '@/features/editor/editorSlice'
import { exportPageSchemaAsJson } from '@/features/editor/exportPageSchemaAsJson'
import { findNodeById } from '@/features/editor/findNodeById'
import { loadSchema, saveSchema } from '@/services/api/schema'
import type { ComponentNode, ComponentPropsPatch, ComponentType, NodeId } from '@/types/schema'
import '@/styles/app.css'

const DEMO_SCHEMA_ID = 'demo-page'

const containerAwareCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  const materialContainerCollision = pointerCollisions.find(
    ({ data }) => data?.droppableContainer.data.current?.kind === 'container-children-drop-zone',
  )

  return materialContainerCollision ? [materialContainerCollision] : closestCenter(args)
}

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const materialItems = Object.values(componentRegistry)
  const currentSchema = useSelector((state: RootState) => state.editor.document.currentSchema)
  const dirty = useSelector((state: RootState) => state.editor.document.dirty)
  const saveStatus = useSelector((state: RootState) => state.editor.ui.saveStatus)
  const loadStatus = useSelector((state: RootState) => state.editor.ui.loadStatus)
  const statusMessage = useSelector((state: RootState) => state.editor.ui.statusMessage)
  const selectedId = useSelector((state: RootState) => state.editor.ui.selectedId)
  const [draftNode, setDraftNode] = useState<ComponentNode | null>(null)

  const selectedNode = selectedId ? findNodeById(currentSchema.root, selectedId) : null
  const saving = saveStatus === 'loading'
  const loading = loadStatus === 'loading'

  const handleInsertMaterial = (type: ComponentType, containerId: NodeId = currentSchema.root.id) => {
    const nextDraftNode = createDefaultNode(type)

    setDraftNode(nextDraftNode)
    dispatch(addNode({ node: nextDraftNode, containerId }))
  }

  const handleSaveSchema = async () => {
    try {
      dispatch(saveSchemaStarted())
      const savedSchema = await saveSchema(DEMO_SCHEMA_ID, currentSchema)
      dispatch(saveSchemaSucceeded(savedSchema))
    } catch (error) {
      dispatch(saveSchemaFailed(error instanceof Error ? error.message : 'Schema 保存失败'))
    }
  }

  const handleLoadSchema = async () => {
    try {
      dispatch(loadSchemaStarted())
      const loadedSchema = await loadSchema(DEMO_SCHEMA_ID)
      setDraftNode(null)
      dispatch(loadSchemaSucceeded(loadedSchema))
    } catch (error) {
      dispatch(loadSchemaFailed(error instanceof Error ? error.message : 'Schema 恢复失败'))
    }
  }

  const handleExportJson = () => {
    exportPageSchemaAsJson(currentSchema)
    dispatch(exportSchemaSucceeded())
  }

  const handleSelectNode = (nodeId: string) => {
    dispatch(selectNode(nodeId))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      return
    }

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.kind === 'material') {
      const componentType = activeData.componentType as ComponentType

      if (overData?.kind === 'container-children-drop-zone') {
        handleInsertMaterial(componentType, overData.containerId as NodeId)
      }

      return
    }

    if (active.id === over.id) {
      return
    }

    if (activeData?.kind === 'canvas-node') {
      const activeContainerId = activeData.containerId as NodeId

      if (overData?.kind === 'canvas-node') {
        const overContainerId = overData.containerId as NodeId

        if (activeContainerId !== overContainerId) {
          return
        }

        dispatch(
          reorderNodesInContainer({
            containerId: activeContainerId,
            activeId: String(active.id),
            overId: String(over.id),
          }),
        )

        return
      }

      if (overData?.kind === 'container-children-drop-zone') {
        const targetContainerId = overData.containerId as NodeId

        if (activeContainerId === targetContainerId) {
          return
        }

        dispatch(
          moveExistingNode({
            nodeId: String(active.id),
            targetContainerId,
          }),
        )
      }
    }
  }

  const handleUpdateSelectedNodeProps = (patch: ComponentPropsPatch) => {
    if (!selectedNode) {
      return
    }

    dispatch(
      updateNodeProps({
        nodeId: selectedNode.id,
        patch,
      }),
    )
  }

  const handleDeleteSelectedNode = () => {
    if (!selectedNode) {
      return
    }

    dispatch(deleteSelectedNode())
  }

  const handleDuplicateSelectedNode = () => {
    if (!selectedNode) {
      return
    }

    dispatch(duplicateSelectedNode())
  }

  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div>
          <p className="editor-kicker">Phase 8</p>
          <h1 className="editor-title">低代码编辑器页面骨架</h1>
          <p className="editor-status">
            {statusMessage} {dirty ? '· 有未保存修改' : '· 已保存'}
          </p>
        </div>

        <div className="editor-toolbar">
          <button type="button" className="toolbar-button" onClick={handleSaveSchema} disabled={!dirty || saving}>
            {saving ? '保存中...' : '保存'}
          </button>
          <button type="button" className="toolbar-button" onClick={handleLoadSchema} disabled={loading}>
            {loading ? '恢复中...' : '恢复'}
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={handleDuplicateSelectedNode}
            disabled={!selectedNode}
          >
            复制当前节点
          </button>
          <button
            type="button"
            className="toolbar-button toolbar-button-danger"
            onClick={handleDeleteSelectedNode}
            disabled={!selectedNode}
          >
            删除当前节点
          </button>
          <button type="button" className="toolbar-button toolbar-button-primary toolbar-button-export" onClick={handleExportJson}>
            <span className="toolbar-button-label">导出</span>
            <span className="toolbar-button-token">JSON</span>
          </button>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={containerAwareCollisionDetection} onDragEnd={handleDragEnd}>
        <main className="editor-main">
          <aside className="editor-panel editor-panel-left">
            <div className="panel-header">
              <h2>物料面板</h2>
              <span>{materialItems.length} 个基础组件</span>
            </div>

            <div className="material-list">
              {materialItems.map((item) => (
                <MaterialPaletteItem
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  description={`${item.canHaveChildren ? '可承载子节点' : '基础叶子组件'} / type: ${item.type}`}
                  active={draftNode?.type === item.type}
                  onInsert={(type) => handleInsertMaterial(type, currentSchema.root.id)}
                />
              ))}
            </div>
          </aside>

          <section className="editor-panel editor-panel-center">
            <div className="panel-header">
              <h2>画布区域</h2>
              <span>{currentSchema.pageMeta.title}</span>
            </div>

            <div className="canvas-stage">
              <div className="canvas-page">
                <PureRenderer
                  schema={currentSchema}
                  selectedId={selectedId}
                  onNodeClick={handleSelectNode}
                />
              </div>
            </div>
          </section>

          <aside className="editor-panel editor-panel-right">
            <div className="panel-header">
              <h2>属性面板</h2>
              <span>{selectedNode ? '支持最小属性编辑闭环' : '点击画布节点查看属性'}</span>
            </div>

            <PropertyPanel
              pageTitle={currentSchema.pageMeta.title}
              selectedId={selectedId}
              selectedNode={selectedNode}
              onUpdateSelectedNodeProps={handleUpdateSelectedNodeProps}
            />
          </aside>
        </main>
      </DndContext>

      <section className="editor-preview editor-panel">
        <div className="panel-header">
          <h2>预览面板</h2>
          <span>{draftNode ? '当前展示新建默认节点结果' : '当前展示 Redux schema 摘要'}</span>
        </div>

        <div className="preview-card">
          {draftNode ? (
            <pre className="preview-code">{JSON.stringify(draftNode, null, 2)}</pre>
          ) : (
            <>
              <p>schema version: {currentSchema.version}</p>
              <p>root children: {currentSchema.root.children.length}</p>
              <p>{currentSchema.pageMeta.description}</p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
