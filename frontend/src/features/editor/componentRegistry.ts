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
}
