import type { ComponentPropsMap, ComponentType } from '@/types/schema'

export interface ComponentRegistryItem<TType extends ComponentType> {
  type: TType
  label: string
  defaultProps: ComponentPropsMap[TType]
  canHaveChildren: boolean
}

export type ComponentRegistry = {
  [TType in ComponentType]: ComponentRegistryItem<TType>
}

export const componentRegistry: ComponentRegistry = {
  banner: {
    type: 'banner',
    label: 'Banner',
    defaultProps: {
      title: '默认 Banner 标题',
      description: '这里是默认 Banner 描述。',
      imageUrl: 'https://dummyimage.com/1200x320/4f46e5/ffffff&text=Banner',
    },
    canHaveChildren: false,
  },
  text: {
    type: 'text',
    label: 'Text',
    defaultProps: {
      content: '默认文本内容',
      color: '#0f172a',
      fontSize: 16,
    },
    canHaveChildren: false,
  },
  container: {
    type: 'container',
    label: 'Container',
    defaultProps: {
      direction: 'vertical',
      gap: 16,
      padding: 24,
      backgroundColor: '#f8fafc',
    },
    canHaveChildren: true,
  },
  form: {
    type: 'form',
    label: 'Form',
    defaultProps: {
      title: '领取专属看房礼包',
      buttonText: '立即预约',
      fields: [
        {
          id: 'default-name',
          label: '姓名',
          placeholder: '请输入姓名',
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
    canHaveChildren: false,
  },
  'activity-card': {
    type: 'activity-card',
    label: 'Activity Card',
    defaultProps: {
      title: '限时特惠房源',
      subtitle: '预约到访可享专属折扣',
      price: '总价 198 万起',
      tags: ['近地铁', '精装交付', '限时折扣'],
    },
    canHaveChildren: false,
  },
}
