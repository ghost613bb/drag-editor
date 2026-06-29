import type { ComponentPropsMap, ComponentType, FormField, NodeId } from '@/types/schema'

export type ComponentCategory = '基础' | '布局' | '表单' | '展示'

export interface ComponentRegistryItem<TType extends ComponentType> {
  type: TType
  label: string
  category: ComponentCategory
  icon: string
  description: string
  defaultProps: ComponentPropsMap[TType]
  createDefaultProps: (nodeId: NodeId) => ComponentPropsMap[TType]
  cloneProps: (props: ComponentPropsMap[TType], nextNodeId: NodeId) => ComponentPropsMap[TType]
  canHaveChildren: boolean
}

export type ComponentRegistry = {
  [TType in ComponentType]: ComponentRegistryItem<TType>
}

function createFormFieldId(nodeId: NodeId) {
  return `${nodeId}-field-${crypto.randomUUID()}`
}

function cloneFormFields(fields: FormField[], nodeId: NodeId) {
  return fields.map((field) => ({
    ...field,
    id: createFormFieldId(nodeId),
  }))
}

export const componentRegistry: ComponentRegistry = {
  banner: {
    type: 'banner',
    label: 'Banner',
    category: '展示',
    icon: 'B',
    description: '用于展示页面主视觉、标题和摘要说明',
    defaultProps: {
      title: '默认 Banner 标题',
      description: '这里是默认 Banner 描述。',
      imageUrl: 'https://dummyimage.com/1200x320/4f46e5/ffffff&text=Banner',
    },
    createDefaultProps() {
      return { ...this.defaultProps }
    },
    cloneProps(props) {
      return { ...props }
    },
    canHaveChildren: false,
  },
  text: {
    type: 'text',
    label: 'Text',
    category: '基础',
    icon: 'T',
    description: '用于展示可配置的文本内容',
    defaultProps: {
      content: '默认文本内容',
      color: '#0f172a',
      fontSize: 16,
    },
    createDefaultProps() {
      return { ...this.defaultProps }
    },
    cloneProps(props) {
      return { ...props }
    },
    canHaveChildren: false,
  },
  container: {
    type: 'container',
    label: 'Container',
    category: '布局',
    icon: 'L',
    description: '用于组织和嵌套子组件',
    defaultProps: {
      direction: 'vertical',
      gap: 16,
      padding: 24,
      backgroundColor: '#f8fafc',
    },
    createDefaultProps() {
      return { ...this.defaultProps }
    },
    cloneProps(props) {
      return { ...props }
    },
    canHaveChildren: true,
  },
  form: {
    type: 'form',
    label: 'Form',
    category: '表单',
    icon: 'F',
    description: '用于收集用户输入信息',
    defaultProps: {
      title: '提交组件配置需求',
      buttonText: '提交需求',
      fields: [
        {
          id: 'default-name',
          label: '联系人',
          placeholder: '请输入联系人',
          type: 'text',
          required: true,
        },
        {
          id: 'default-phone',
          label: '手机号',
          placeholder: '请输入手机号',
          type: 'phone',
          required: true,
        },
      ],
    },
    createDefaultProps(nodeId) {
      return {
        ...this.defaultProps,
        fields: cloneFormFields(this.defaultProps.fields, nodeId),
      }
    },
    cloneProps(props, nextNodeId) {
      return {
        ...props,
        fields: cloneFormFields(props.fields, nextNodeId),
      }
    },
    canHaveChildren: false,
  },
  'activity-card': {
    type: 'activity-card',
    label: 'Activity Card',
    category: '展示',
    icon: 'C',
    description: '用于突出展示一组能力、指标或标签',
    defaultProps: {
      title: '组件能力亮点',
      subtitle: '展示可拖拽编辑器的核心模块与配置项',
      price: '3 个核心能力',
      tags: ['拖拽编排', '属性配置', '实时预览'],
    },
    createDefaultProps() {
      return {
        ...this.defaultProps,
        tags: [...this.defaultProps.tags],
      }
    },
    cloneProps(props) {
      return {
        ...props,
        tags: [...props.tags],
      }
    },
    canHaveChildren: false,
  },
}
