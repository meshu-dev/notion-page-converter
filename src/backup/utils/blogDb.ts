import type { NotionPage, NotionTag } from "@/types/notion"

export const addPost = async (env: any, page: NotionPage) => {
  const statement: string = `
    INSERT INTO posts (
      notion_page_id,
      slug,
      heading,
      status,
      tags,
      published_at,
      created_at,
      updated_at
    )
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`


  return await env.DB
    .prepare(
      statement
    )
    .bind(
      page.id,
      page.slug,
      page.heading,
      page.status,
      JSON.stringify(page.tags),
      page.publishedAt,
      page.createdAt,
      page.updatedAt
    ).run()
}

export const getPostByPageId = async (env: any, notionPageId: string) => {
  const statement: string = `
    SELECT * FROM posts WHERE notion_page_id = ?`


  return await env.DB
    .prepare(
      statement
    )
    .bind(
      notionPageId
    )
    .first()
}

export const addPostTag = async (env: any, tag: NotionTag) => {
  const statement: string = `
    INSERT INTO post_tags (
      notion_tag_id,
      name,
      color
    )
    VALUES (?1, ?2, ?3)`


  return await env.DB
    .prepare(
      statement
    )
    .bind(
      tag.id,
      tag.name,
      tag.color
    ).run()
}

export const getPostTagByTagId = async (env: any, notionTagId: string) => {
  const statement: string = `
    SELECT * FROM post_tags WHERE notion_tag_id = ?`


  return await env.DB
    .prepare(
      statement
    )
    .bind(
      notionTagId
    )
    .first()
}