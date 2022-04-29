const { handleError } = require('./handleError.cjs')

/**
 * @param {import('jsdom').JSDOM} jsdom
 * @param {string} tag
 * @param {string} text
 *
 * @returns {Node | null}
 */
function findJsdomElementContainingText(jsdom, tag, text) {
  try {
    return jsdom.window.document.evaluate(
      `//${tag}[text()='${text}']`,
      jsdom.window.document,
      null,
      jsdom.window.XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue
  } catch (err) {
    handleError(err, 'helpers/findJsdomElementContainingText()')

    return null
  }
}

module.exports = { findJsdomElementContainingText }
