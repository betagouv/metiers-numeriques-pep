import TurndownService from 'turndown'

const turndownService = new TurndownService()

export function convertHtmlToMarkdown(htmlSource: string): string {
  const markdownSource = turndownService.turndown(htmlSource)

  return markdownSource
}
