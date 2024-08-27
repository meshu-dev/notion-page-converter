import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { MdStringObject } from 'notion-to-md/build/types'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import customHeadingId from "marked-custom-heading-id"
import { MarkdownBlock } from './types'
import { addTableOfContents, hasTableOfContents } from './toc'



export const notionPageToHtml = async (notionApiToken: string, pageId: string): Promise<string | null> => {
  // Setup Notion client and Notion to Markdown converter
  const notionClient: Client = new Client({ auth: notionApiToken })
  const notionToMarkdown: NotionToMarkdown = new NotionToMarkdown({ notionClient: notionClient })

  // Convert page blocks to Markdown
  let markdownBlocks: MarkdownBlock[] = await notionToMarkdown.pageToMarkdown(pageId) as MarkdownBlock[]

  if (hasTableOfContents(markdownBlocks)) {
    markdownBlocks = addTableOfContents(markdownBlocks)
  }

  const markdown: MdStringObject = await notionToMarkdown.toMarkdownString(markdownBlocks)

  // Setup Markdown to HTML converter
  const marked: Marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      }
    })
  )
  marked.use(customHeadingId())

  // Convert to HTML
  return markdown.parent ? await marked.parse(markdown.parent) : null
}

export const htmlResponse = (html: string, status: number = 200) => {
  return new Response(
    html,
    {
      status,
      headers: {
        "content-type": "text/html;charset=UTF-8"
      }
    }
  )
}
