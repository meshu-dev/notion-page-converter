import { NotionToMarkdown } from 'notion-to-md'
import type { MdStringObject } from 'notion-to-md/build/types'
import { getNotionClient } from '@/utils/notion'

const getNotionToMarkdown = (token: string): NotionToMarkdown => {
  const notion = getNotionClient(token)
  return new NotionToMarkdown({ notionClient: notion })
}

export const getPageMarkdown = async (token: string, pageId: string): Promise<MdStringObject> => {
  const n2m = getNotionToMarkdown(token)

  const mdblocks = await n2m.pageToMarkdown(pageId)
  return n2m.toMarkdownString(mdblocks)
}