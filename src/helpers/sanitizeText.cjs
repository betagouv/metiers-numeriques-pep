/**
 * @param {string} text
 *
 * @returns {string}
 */
function sanitizeText(text) {
  return text.replace(/\s+/g, ' ').trim()
}

module.exports = { sanitizeText }
