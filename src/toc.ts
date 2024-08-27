import { MarkdownBlock } from "./types"

const generateHeadingId = (heading: string): string => {
  return heading
    .replace(/#/g, '')
    .trim()
    .toLowerCase()
    .replace(/ /g, '-')
}

const addHeadingIds = (markdownBlocks: MarkdownBlock[]): MarkdownBlock[] => {
  const headingBlocks: MarkdownBlock[] = [];

  for (let i = 0; i < markdownBlocks.length; i++) {
    const markdown: MarkdownBlock = markdownBlocks[i]

    if (markdown.type === 'heading_2') {
      headingBlocks.push(markdown)

      const heading: string = generateHeadingId(markdown.parent)
      markdownBlocks[i].parent += ` {#${heading}}`
    }
  }
  return markdownBlocks
}

const getHeadingBlocks = (markdownBlocks: MarkdownBlock[]) => {
  const headingBlocks: MarkdownBlock[] = [];

  for (let i = 0; i < markdownBlocks.length; i++) {
    const markdown: MarkdownBlock = markdownBlocks[i]

    if (markdown.type === 'heading_2') {
      headingBlocks.push(markdown)
    }
  }
  return headingBlocks
}

const generateTocItem = (headingBlock: MarkdownBlock) => {
  const headingParts: string[] = headingBlock.parent.replace(/#/g, '').split('{')
  const heading: string = headingParts[0].trim()
  const headingId: string = headingParts[1].substring(0, headingParts[1].length - 1)

  return `- [${heading}](#${headingId})\n`
}

const applyToc = (markdownBlocks: MarkdownBlock[], toc: string): MarkdownBlock[] => {
  for (let i = 0; i < markdownBlocks.length; i++) {
    const markdownBlock: MarkdownBlock = markdownBlocks[i]

    if (markdownBlock.type === 'table_of_contents') {
      markdownBlocks[i].parent = toc
    }
  }
  return markdownBlocks
}

export const hasTableOfContents = (markdownBlocks: MarkdownBlock[]): boolean => {
  for (const markdownBlock of markdownBlocks) {
    if (markdownBlock.type === 'table_of_contents') {
      return true
    }
  }
  return false
}

export const addTableOfContents = (markdownBlocks: MarkdownBlock[]): MarkdownBlock[] => {
  markdownBlocks = addHeadingIds(markdownBlocks)

  const headingBlocks: MarkdownBlock[] = getHeadingBlocks(markdownBlocks)

  let toc = ''

  for (const headingBlock of headingBlocks) {
    let tocItem: string = generateTocItem(headingBlock)
    toc += tocItem
  }

  return applyToc(markdownBlocks, toc)
}
