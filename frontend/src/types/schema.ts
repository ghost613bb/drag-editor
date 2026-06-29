export type NodeId = string

export type ComponentType = 'banner' | 'text' | 'container' | 'form' | 'activity-card'

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

export type FormFieldType = 'text' | 'phone'

export interface FormField {
  id: string
  label: string
  placeholder: string
  type: FormFieldType
  required: boolean
}

export interface FormProps {
  title: string
  buttonText: string
  fields: FormField[]
}

export interface ActivityCardProps {
  title: string
  subtitle: string
  price: string
  tags: string[]
}

export interface ComponentPropsMap {
  banner: BannerProps
  text: TextProps
  container: ContainerProps
  form: FormProps
  'activity-card': ActivityCardProps
}

export type ComponentPropsPatch =
  | Partial<BannerProps>
  | Partial<TextProps>
  | Partial<ContainerProps>
  | Partial<FormProps>
  | Partial<ActivityCardProps>

export interface BaseNode<TType extends ComponentType> {
  id: NodeId
  type: TType
  props: ComponentPropsMap[TType]
}

export type BannerNode = BaseNode<'banner'>

export type TextNode = BaseNode<'text'>

export type FormNode = BaseNode<'form'>

export type ActivityCardNode = BaseNode<'activity-card'>

export interface ContainerNode extends BaseNode<'container'> {
  children: ComponentNode[]
}

export type ComponentNode = BannerNode | TextNode | ContainerNode | FormNode | ActivityCardNode

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

export interface EditorDocumentState {
  currentSchema: PageSchema
  publishedSchema: PageSchema | null
  dirty: boolean
}

export interface EditorHistoryState {
  past: PageSchema[]
  future: PageSchema[]
  activePropertyEditGroup: string | null
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface EditorUIState {
  selectedId: NodeId | null
  hoveredId: NodeId | null
  saveStatus: AsyncStatus
  loadStatus: AsyncStatus
  statusMessage: string
}

export interface EditorState {
  document: EditorDocumentState
  ui: EditorUIState
  history: EditorHistoryState
}
