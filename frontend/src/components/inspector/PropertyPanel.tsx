import { componentRegistry } from '@/features/editor/componentRegistry'
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

function renderTypeSpecificFields(
  node: ComponentNode,
  onUpdateSelectedNodeProps: (patch: ComponentPropsPatch, options?: PropertyUpdateOptions) => void,
  onEndPropertyEditGesture: () => void,
) {
  const updateGroupedProp = (propName: string, patch: ComponentPropsPatch) => {
    onUpdateSelectedNodeProps(patch, {
      historyGroupId: getPropertyHistoryGroupId(node, propName),
    })
  }

  const updateGroupedNumberProp = (propName: string, rawValue: string) => {
    const numericValue = parseNumberInputValue(rawValue)

    if (numericValue === null) {
      return
    }

    updateGroupedProp(propName, { [propName]: numericValue } as ComponentPropsPatch)
  }

  switch (node.type) {
    case 'banner':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Banner 属性</h3>
          <div className="property-list">
            <div className="property-item">
              <label htmlFor="banner-title-input">标题</label>
              <input
                id="banner-title-input"
                className="property-input"
                value={node.props.title}
                onChange={(event) => updateGroupedProp('title', { title: event.target.value })}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <div className="property-item">
              <label htmlFor="banner-description-input">描述</label>
              <textarea
                id="banner-description-input"
                className="property-textarea"
                value={node.props.description}
                onChange={(event) => updateGroupedProp('description', { description: event.target.value })}
                onBlur={onEndPropertyEditGesture}
                rows={4}
              />
            </div>
            <div className="property-item">
              <label htmlFor="banner-image-input">图片地址</label>
              <input
                id="banner-image-input"
                className="property-input"
                value={node.props.imageUrl}
                onChange={(event) => updateGroupedProp('imageUrl', { imageUrl: event.target.value })}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
          </div>
        </div>
      )

    case 'text':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Text 属性</h3>
          <div className="property-list">
            <div className="property-item">
              <label htmlFor="text-content-input">文本内容</label>
              <textarea
                id="text-content-input"
                className="property-textarea"
                value={node.props.content}
                onChange={(event) => updateGroupedProp('content', { content: event.target.value })}
                onBlur={onEndPropertyEditGesture}
                rows={4}
              />
            </div>
            <div className="property-item">
              <label htmlFor="text-color-input">颜色</label>
              <input
                id="text-color-input"
                className="property-input"
                value={node.props.color}
                onChange={(event) => updateGroupedProp('color', { color: event.target.value })}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <div className="property-item">
              <label htmlFor="text-font-size-input">字号</label>
              <input
                id="text-font-size-input"
                className="property-input"
                type="number"
                value={node.props.fontSize}
                onChange={(event) => updateGroupedNumberProp('fontSize', event.target.value)}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
          </div>
        </div>
      )

    case 'container':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Container 属性</h3>
          <div className="property-list">
            <div className="property-item">
              <label htmlFor="container-direction-select">布局方向</label>
              <select
                id="container-direction-select"
                className="property-select"
                value={node.props.direction}
                onChange={(event) =>
                  updateGroupedProp('direction', {
                    direction: event.target.value as 'vertical' | 'horizontal',
                  })
                }
                onBlur={onEndPropertyEditGesture}
              >
                <option value="vertical">vertical</option>
                <option value="horizontal">horizontal</option>
              </select>
            </div>
            <div className="property-item">
              <label htmlFor="container-gap-input">间距</label>
              <input
                id="container-gap-input"
                className="property-input"
                type="number"
                value={node.props.gap}
                onChange={(event) => updateGroupedNumberProp('gap', event.target.value)}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <div className="property-item">
              <label htmlFor="container-padding-input">内边距</label>
              <input
                id="container-padding-input"
                className="property-input"
                type="number"
                value={node.props.padding}
                onChange={(event) => updateGroupedNumberProp('padding', event.target.value)}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <div className="property-item">
              <label htmlFor="container-background-input">背景色</label>
              <input
                id="container-background-input"
                className="property-input"
                value={node.props.backgroundColor}
                onChange={(event) => updateGroupedProp('backgroundColor', { backgroundColor: event.target.value })}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <PropertyRow label="子节点数量" value={node.children.length} />
          </div>
        </div>
      )

    case 'form': {
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
          <h3 className="property-group-title">Form 属性</h3>
          <div className="property-list">
            <div className="property-item">
              <label htmlFor="form-title-input">表单标题</label>
              <input
                id="form-title-input"
                className="property-input"
                value={node.props.title}
                onChange={(event) => updateGroupedProp('title', { title: event.target.value })}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <div className="property-item">
              <label htmlFor="form-button-input">按钮文案</label>
              <input
                id="form-button-input"
                className="property-input"
                value={node.props.buttonText}
                onChange={(event) => updateGroupedProp('buttonText', { buttonText: event.target.value })}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <div className="property-field-section">
              <div className="property-field-section-header">
                <span>字段配置</span>
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
        </div>
      )
    }

    case 'activity-card':
      return (
        <div className="property-group">
          <h3 className="property-group-title">Activity Card 属性</h3>
          <div className="property-list">
            <div className="property-item">
              <label htmlFor="activity-card-title-input">标题</label>
              <input
                id="activity-card-title-input"
                className="property-input"
                value={node.props.title}
                onChange={(event) => updateGroupedProp('title', { title: event.target.value })}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <div className="property-item">
              <label htmlFor="activity-card-subtitle-input">副标题</label>
              <textarea
                id="activity-card-subtitle-input"
                className="property-textarea"
                value={node.props.subtitle}
                onChange={(event) => updateGroupedProp('subtitle', { subtitle: event.target.value })}
                onBlur={onEndPropertyEditGesture}
                rows={3}
              />
            </div>
            <div className="property-item">
              <label htmlFor="activity-card-price-input">亮点信息</label>
              <input
                id="activity-card-price-input"
                className="property-input"
                value={node.props.price}
                onChange={(event) => updateGroupedProp('price', { price: event.target.value })}
                onBlur={onEndPropertyEditGesture}
              />
            </div>
            <div className="property-item">
              <label htmlFor="activity-card-tags-input">标签（每行一个）</label>
              <textarea
                id="activity-card-tags-input"
                className="property-textarea"
                value={node.props.tags.join('\n')}
                onChange={(event) => updateGroupedProp('tags', { tags: normalizeTagsInput(event.target.value) })}
                onBlur={onEndPropertyEditGesture}
                rows={4}
              />
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
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
