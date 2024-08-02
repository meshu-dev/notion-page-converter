import { Client } from '@notionhq/client'
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import type { NotionPage } from '@/types/notion'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter)

export const getNotionClient = (token: string): Client => {
  return new Client({ auth: token })
}

export const getNotionDatabase = async (token: string, notionDatabaseId: string): Promise<QueryDatabaseResponse> => {
  const notion = getNotionClient(token)

  return await notion.databases.query({
    database_id: notionDatabaseId
  })
}

export const getNotionPage = async (token: string, pageId: string): Promise<NotionPage> => {
  const notion = getNotionClient(token)
  const page = await notion.pages.retrieve({ page_id: pageId })
  return makeNotionPage(page)
}

export const getNotionPages = async (token: string, notionDatabaseId: string): Promise<NotionPage[]> => {
  const database: QueryDatabaseResponse = await getNotionDatabase(token, notionDatabaseId)
  const pages: NotionPage[] = []

  for (let page of database.results) {
    const notionPage: NotionPage = makeNotionPage(page)

    if (
      notionPage.slug &&
      notionPage.status === 'Done' &&
      notionPage.publishedAt &&
      dayjs().isSameOrAfter(dayjs(notionPage.publishedAt))
    ) {
      pages.push(notionPage)
    }
  }
  return pages
}

export const getNotionPagesByTag = async (token: string, notionDatabaseId: string, tag: string): Promise<NotionPage[]> => {
  const pages: NotionPage[] = await getNotionPages(token, notionDatabaseId)
  const taggedPages: NotionPage[] = []

  for (const page of pages) {
    let hasTag = false

    for (const pageTag of page.tags) {
      if (pageTag.name == tag) {
        hasTag = true
        break
      }
    }

    if (hasTag) {
      taggedPages.push(page)
    }
  }
  return taggedPages
}

const makeNotionPage = (page: any): NotionPage => {
  const properties = page.properties

  const notionPage: NotionPage = {
    id: page.id,
    slug: properties.URL.url,
    heading: properties.Name.title[0]['plain_text'],
    status: properties.Status.status.name,
    tags: properties.Tags.multi_select,
    publishedAt: properties.Published.date?.start,
    createdAt: properties.Created.created_time,
    updatedAt: properties.Updated.last_edited_time
  }
  return notionPage
}