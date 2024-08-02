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

import { Env, RequestParams } from './types'
import { htmlResponse, notionPageToHtml } from './utils'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const authToken: string | null = env.AUTH_TOKEN || null
    const notionApiToken: string | null = env.NOTION_API_TOKEN || null

    const authorization = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!authorization || authorization != authToken) {
      return htmlResponse('Unauthorized', 401)
    }

    const contentType: string | null = request.headers.get('content-type')

    if (!contentType || contentType != 'application/json') {
      return htmlResponse('Content type must be JSON')
    }

    const params: RequestParams = await request.json()
    const pageId: string = params.pageId

    if (!notionApiToken || !pageId) {
      return htmlResponse('Notion credentials are required');
    }

    const html: string | null = await notionPageToHtml(notionApiToken, pageId)
    return htmlResponse(html ? html : 'Error occurred converting to HTML')
  },
} satisfies ExportedHandler<Env>
