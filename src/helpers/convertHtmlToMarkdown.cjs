const TurndownService = require('turndown')

const turndownService = new TurndownService()

/**
 * @param {string} htmlSource
 *
 * @returns {string}
 */
function convertHtmlToMarkdown(htmlSource) {
  const markdownSource = turndownService.turndown(htmlSource)

  return markdownSource
}

module.exports = { convertHtmlToMarkdown }
