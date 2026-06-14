export type NodeId = string

export type ComponentType = 'banner' | 'text' | 'container'

export interface BannerProps {
  title: string
  description: string
  imageUrl: string
}

export interface TextProps {
  content: string
  color: string
  fontSize: number
}

export interface ContainerProps {
  direction: 'vertical' | 'horizontal'
  gap: number
  padding: number
  backgroundColor: string
}

export interface ComponentPropsMap {
  banner: BannerProps
  text: TextProps
  container: ContainerProps
}

export interface BaseNode<TType extends ComponentType> {
  id: NodeId
  type: TType
  props: ComponentPropsMap[TType]
}

export interface BannerNode extends BaseNode<'banner'> {}

export interface TextNode extends BaseNode<'text'> {}

export interface ContainerNode extends BaseNode<'container'> {
  children: ComponentNode[]
}

export type ComponentNode = BannerNode | TextNode | ContainerNode

export interface PageMeta {
  id: string
  title: string
  description?: string
}

export interface PageSchema {
  version: number
  pageMeta: PageMeta
  root: ContainerNode
}
