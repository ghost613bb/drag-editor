import { componentRegistry, type PropertyFieldSchema } from '@/features/editor/componentRegistry'
import type { ComponentNode, ComponentPropsPatch, FormField, FormFieldType, NodeId } from '@/types/schema'

interface PropertyUpdateOptions {
  historyGroupId?: string
}

interface PropertyPanelProps {
  pageTitle: string
  selectedId: NodeId | null
  selectedNode: ComponentNode | null
  onUpdateSelectedNodeProps: (patch: ComponentPropsPatch, options?: PropertyUpdateOptions) => void
  onEndPropertyEditGesture: () => void
}

function PropertyRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="property-item">
      <label>{label}</label>
      <div className="property-value">{value}</div>
    </div>
  )
}

function getPropertyHistoryGroupId(node: ComponentNode, propName: string) {
  return `property:${node.id}:${propName}`
}

function getFormFieldHistoryGroupId(nodeId: NodeId, fieldId: string, propName: string) {
  return `property:${nodeId}:fields:${fieldId}:${propName}`
}

function createFormFieldId(nodeId: NodeId) {
  return `${nodeId}-field-${crypto.randomUUID()}`
}

function createDefaultFormField(nodeId: NodeId, index: number): FormField {
  return {
    id: createFormFieldId(nodeId),
    label: `字段 ${index + 1}`,
    placeholder: '请输入内容',
    type: 'text',
    required: false,
  }
}

function createPropPatch(propName: string, value: unknown): ComponentPropsPatch {
  return { [propName]: value } as ComponentPropsPatch
}

function getPropertyValueAsString(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

function normalizeTagsInput(value: string) {
  return value
    .split('\n')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function parseNumberInputValue(rawValue: string) {
  if (rawValue.trim() === '') {
    return 0
  }

  const numericValue = Number(rawValue)
  return Number.isFinite(numericValue) ? numericValue : null
}

function renderSchemaPropertyFields(
  node: ComponentNode,
  propertySchema: readonly PropertyFieldSchema[],
  onUpdateProperty: (propName: string, value: unknown) => void,
  onEndPropertyEditGesture: () => void,
) {
  const props = node.props as unknown as Record<string, unknown>

  return propertySchema.map((field) => {
    const propName = String(field.prop)
    const fieldId = `${node.id}-${propName}-input`
    const value = props[propName]

    switch (field.control) {
      case 'textarea':
        return (
          <div className="property-item" key={propName}>
            <label htmlFor={fieldId}>{field.label}</label>
            <textarea
              id={fieldId}
              className="property-textarea"
              value={getPropertyValueAsString(value)}
              onChange={(event) => onUpdateProperty(propName, event.target.value)}
              onBlur={onEndPropertyEditGesture}
              rows={field.rows ?? 4}
            />
          </div>
        )

      case 'number':
        return (
          <div className="property-item" key={propName}>
            <label htmlFor={fieldId}>{field.label}</label>
            <input
              id={fieldId}
              className="property-input"
              type="number"
              value={getPropertyValueAsString(value)}
              onChange={(event) => {
                const numericValue = parseNumberInputValue(event.target.value)

                if (numericValue !== null) {
                  onUpdateProperty(propName, numericValue)
                }
              }}
              onBlur={onEndPropertyEditGesture}
            />
          </div>
        )

      case 'select':
        return (
          <div className="property-item" key={propName}>
            <label htmlFor={fieldId}>{field.label}</label>
            <select
              id={fieldId}
              className="property-select"
              value={getPropertyValueAsString(value)}
              onChange={(event) => {
                const selectedOption = field.options?.find(
                  (option) => String(option.value) === event.target.value,
                )

                onUpdateProperty(propName, selectedOption?.value ?? event.target.value)
              }}
              onBlur={onEndPropertyEditGesture}
            >
              {field.options?.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'stringList':
        return (
          <div className="property-item" key={propName}>
            <label htmlFor={fieldId}>{field.label}</label>
            <textarea
              id={fieldId}
              className="property-textarea"
              value={Array.isArray(value) ? value.join('\n') : ''}
              onChange={(event) => onUpdateProperty(propName, normalizeTagsInput(event.target.value))}
              onBlur={onEndPropertyEditGesture}
              rows={field.rows ?? 4}
            />
          </div>
        )

      case 'text':
      default:
        return (
          <div className="property-item" key={propName}>
            <label htmlFor={fieldId}>{field.label}</label>
            <input
              id={fieldId}
              className="property-input"
              value={getPropertyValueAsString(value)}
              onChange={(event) => onUpdateProperty(propName, event.target.value)}
              onBlur={onEndPropertyEditGesture}
            />
          </div>
        )
    }
  })
}

function renderFormFieldsEditor(
  node: Extract<ComponentNode, { type: 'form' }>,
  onUpdateSelectedNodeProps: (patch: ComponentPropsPatch, options?: PropertyUpdateOptions) => void,
  onEndPropertyEditGesture: () => void,
) {
  const updateFormField = (
    fieldId: string,
    patch: Partial<FormField>,
    propName: keyof FormField,
  ) => {
    const nextFields = node.props.fields.map((field) => (
      field.id === fieldId ? { ...field, ...patch } : field
    ))

    onUpdateSelectedNodeProps(
      { fields: nextFields },
      { historyGroupId: getFormFieldHistoryGroupId(node.id, fieldId, propName) },
    )
  }

  const addFormField = () => {
    onUpdateSelectedNodeProps({
      fields: [
        ...node.props.fields,
        createDefaultFormField(node.id, node.props.fields.length),
      ],
    })
  }

  const removeFormField = (fieldId: string) => {
    if (node.props.fields.length <= 1) {
      return
    }

    onUpdateSelectedNodeProps({
      fields: node.props.fields.filter((field) => field.id !== fieldId),
    })
  }

  return (
    <div className="property-group">
      <h3 className="property-group-title">字段配置</h3>
      <div className="property-field-section">
        <div className="property-field-section-header">
          <span>字段列表</span>
          <button type="button" className="property-small-button" onClick={addFormField}>
            新增字段
          </button>
        </div>
        <div className="property-field-list">
          {node.props.fields.map((field, index) => (
            <div className="property-field-card" key={field.id}>
              <div className="property-field-card-header">
                <div>
                  <strong>字段 {index + 1}</strong>
                  <span className="property-field-meta">
                    {field.type === 'phone' ? '手机号' : '文本输入'} / {field.required ? '必填' : '选填'}
                  </span>
                </div>
                <button
                  type="button"
                  className="property-small-button property-danger-button"
                  onClick={() => removeFormField(field.id)}
                  disabled={node.props.fields.length <= 1}
                >
                  删除
                </button>
              </div>
              <div className="property-item">
                <label htmlFor={`${field.id}-label-input`}>字段名称</label>
                <input
                  id={`${field.id}-label-input`}
                  className="property-input"
                  value={field.label}
                  onChange={(event) => updateFormField(field.id, { label: event.target.value }, 'label')}
                  onBlur={onEndPropertyEditGesture}
                />
              </div>
              <div className="property-item">
                <label htmlFor={`${field.id}-placeholder-input`}>占位文案</label>
                <input
                  id={`${field.id}-placeholder-input`}
                  className="property-input"
                  value={field.placeholder}
                  onChange={(event) =>
                    updateFormField(field.id, { placeholder: event.target.value }, 'placeholder')
                  }
                  onBlur={onEndPropertyEditGesture}
                />
              </div>
              <div className="property-item">
                <label htmlFor={`${field.id}-type-select`}>字段类型</label>
                <select
                  id={`${field.id}-type-select`}
                  className="property-select"
                  value={field.type}
                  onChange={(event) =>
                    updateFormField(field.id, { type: event.target.value as FormFieldType }, 'type')
                  }
                  onBlur={onEndPropertyEditGesture}
                >
                  <option value="text">文本</option>
                  <option value="phone">手机号</option>
                </select>
              </div>
              <label className="property-checkbox-row" htmlFor={`${field.id}-required-input`}>
                <input
                  id={`${field.id}-required-input`}
                  type="checkbox"
                  checked={field.required}
                  onChange={(event) => updateFormField(field.id, { required: event.target.checked }, 'required')}
                  onBlur={onEndPropertyEditGesture}
                />
                <span>设为必填字段</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function renderTypeSpecificFields(
  node: ComponentNode,
  onUpdateSelectedNodeProps: (patch: ComponentPropsPatch, options?: PropertyUpdateOptions) => void,
  onEndPropertyEditGesture: () => void,
) {
  const registryItem = componentRegistry[node.type]

  const updateGroupedProp = (propName: string, value: unknown) => {
    onUpdateSelectedNodeProps(createPropPatch(propName, value), {
      historyGroupId: getPropertyHistoryGroupId(node, propName),
    })
  }

  return (
    <>
      <div className="property-group">
        <h3 className="property-group-title">{registryItem.label} 属性</h3>
        <div className="property-list">
          {renderSchemaPropertyFields(
            node,
            registryItem.propertySchema as readonly PropertyFieldSchema[],
            updateGroupedProp,
            onEndPropertyEditGesture,
          )}
          {node.type === 'container' ? <PropertyRow label="子节点数量" value={node.children.length} /> : null}
        </div>
      </div>

      {node.type === 'form'
        ? renderFormFieldsEditor(node, onUpdateSelectedNodeProps, onEndPropertyEditGesture)
        : null}
    </>
  )
}

export function PropertyPanel({
  pageTitle,
  selectedId,
  selectedNode,
  onUpdateSelectedNodeProps,
  onEndPropertyEditGesture,
}: PropertyPanelProps) {
  if (!selectedNode) {
    return (
      <div className="panel-empty-state">
        <p>当前还没有选中节点。</p>
        <p>点击画布中的 Banner / Text / Container / Form / Activity Card 后，这里会展示对应节点属性。</p>
      </div>
    )
  }

  const registryItem = componentRegistry[selectedNode.type]

  return (
    <div className="property-panel-body">
      <div className="property-group">
        <h3 className="property-group-title">基础信息</h3>
        <div className="property-list">
          <PropertyRow label="页面标题" value={pageTitle} />
          <PropertyRow label="组件名称" value={registryItem.label} />
          <PropertyRow label="组件类型" value={registryItem.type} />
          <PropertyRow label="组件分类" value={registryItem.category} />
          <PropertyRow label="组件标识" value={registryItem.icon} />
          <PropertyRow label="组件描述" value={registryItem.description} />
          <PropertyRow label="节点 ID" value={selectedNode.id} />
          <PropertyRow label="Redux selectedId" value={selectedId ?? '未选中'} />
          <PropertyRow
            label="组件能力"
            value={registryItem.canHaveChildren ? '可承载子节点' : '基础叶子组件'}
          />
        </div>
      </div>

      {renderTypeSpecificFields(
        selectedNode,
        onUpdateSelectedNodeProps,
        onEndPropertyEditGesture,
      )}
    </div>
  )
}
