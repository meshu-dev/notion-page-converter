/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { NotionPage } from "@/types/notion"
import { getNotionPages } from "@/utils/notion"
import { getPostByPageId, addPost, addPostTag } from "./utils/blogDb"
import { getPageMarkdown } from "./utils/notionMarkdown"
import { getPageBody } from "./utils/blog"
//import { Env } from "./types/env"

export default {
  async fetch(request, env, ctx): Promise<Response> {
    console.log(`Test 1`)

    const notionApiToken: string | null = env.NOTION_API_TOKEN || null
    const notionDatabaseId: string | null = env.NOTION_DATABASE_ID || null

    let result = null

    if (notionApiToken && notionDatabaseId) {
      const pages: NotionPage[] = await getNotionPages(notionApiToken, notionDatabaseId)



      for (const page of pages) {
        console.log(`Notion Page | Id: Slug: ${page.id} | Slug: ${page.slug}`)

        result = await getPageBody(notionApiToken, page.id);
        break
        /*
        const blog = await getPostByPageId(env, page.id)

        if (!blog) {
          const result = await addPost(env, page)

          if (result.success) {
            // TODO
            // Do something on failure

            const result = await addPostTag(env, page.tags)
          }
        } */
      }
    }

    return new Response(result);
  },
} satisfies ExportedHandler<any>
