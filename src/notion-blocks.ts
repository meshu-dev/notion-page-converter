import { addTableOfContents, hasTableOfContents } from "./toc"
import { MarkdownBlock } from "./types"

export const hasVideo = (markdownBlocks: MarkdownBlock[]): boolean => {
  for (const markdownBlock of markdownBlocks) {
    if (markdownBlock.type === 'video') {
      return true
    }
  }
  return false
}

export const addVideo = (markdownBlocks: MarkdownBlock[]): MarkdownBlock[] => {
  for (let i = 0; i < markdownBlocks.length; i++) {
    const markdownBlock: MarkdownBlock = markdownBlocks[i]

    if (markdownBlock.type === 'video') {
      const youtubeId: string = markdownBlocks[i].parent.replace('[video](https://www.youtube.com/watch?v=', '').slice(0, -1)
      markdownBlocks[i].parent = `<iframe width="688" height="400" src="https://www.youtube.com/embed/${youtubeId}"></iframe>`
    }
  }
  return markdownBlocks
}


export const addUnsupportedBlocks = (markdownBlocks: MarkdownBlock[]): MarkdownBlock[] => {
  if (hasTableOfContents(markdownBlocks)) {
    markdownBlocks = addTableOfContents(markdownBlocks)
  }

  if (hasVideo(markdownBlocks)) {
    markdownBlocks = addVideo(markdownBlocks)
  }

  return markdownBlocks
}