export type Env = {
  AUTH_TOKEN: string
  NOTION_API_TOKEN: string
}

export type RequestParams = {
  pageId: string
}

export type MarkdownBlock = {
  type: string
  blockId: string
  parent: string
  children: any[]
}
