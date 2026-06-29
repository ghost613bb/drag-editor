import type { PageSchema } from '@/types/schema'

export const mockPageSchema: PageSchema = {
  version: 1,
  pageMeta: {
    id: 'summer-campaign',
    title: '夏日营销活动页',
    description: '用于 Phase 1 / Phase 2 演示的默认页面结构。',
  },
  root: {
    id: 'root-container',
    type: 'container',
    props: {
      direction: 'vertical',
      gap: 16,
      padding: 24,
      backgroundColor: '#ffffff',
    },
    children: [
      {
        id: 'banner-1',
        type: 'banner',
        props: {
          title: '暑期购房节',
          description: '精选特惠房源，限时领取专属优惠。',
          imageUrl: 'https://dummyimage.com/1200x320/4f46e5/ffffff&text=Summer+Campaign',
        },
      },
      {
        id: 'text-1',
        type: 'text',
        props: {
          content: '通过低代码编辑器快速搭建你的活动页面。',
          color: '#0f172a',
          fontSize: 16,
        },
      },
      {
        id: 'activity-card-1',
        type: 'activity-card',
        props: {
          title: '限时特惠房源',
          subtitle: '预约到访可享专属折扣',
          price: '总价 198 万起',
          tags: ['近地铁', '精装交付', '限时折扣'],
        },
      },
      {
        id: 'form-1',
        type: 'form',
        props: {
          title: '领取专属看房礼包',
          buttonText: '立即预约',
          fields: [
            {
              id: 'form-1-field-name',
              label: '姓名',
              placeholder: '请输入姓名',
              type: 'text',
              required: true,
            },
            {
              id: 'form-1-field-phone',
              label: '手机号',
              placeholder: '请输入手机号',
              type: 'phone',
              required: true,
            },
          ],
        },
      },
      {
        id: 'container-1',
        type: 'container',
        props: {
          direction: 'vertical',
          gap: 12,
          padding: 20,
          backgroundColor: '#f8fafc',
        },
        children: [
          {
            id: 'text-2',
            type: 'text',
            props: {
              content: 'Container 内部子组件占位 1',
              color: '#334155',
              fontSize: 14,
            },
          },
          {
            id: 'text-3',
            type: 'text',
            props: {
              content: 'Container 内部子组件占位 2',
              color: '#475569',
              fontSize: 14,
            },
          },
        ],
      },
    ],
  },
}
