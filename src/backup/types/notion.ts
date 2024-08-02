export type NotionPage = {
  id: string
  slug: string
  heading: string
  status: string
  tags: NotionTag[]
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type NotionTag = {
  id: string
  name: string
  color: string
}