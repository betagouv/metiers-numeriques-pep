const axios = require('axios')
const { JSDOM } = require('jsdom')

const MAX_RETRIES_COUNT = 5

/**
 * @param {string} url
 * @param {number=} retriesCount
 *
 * @returns {import('jsdom').JSDOM}
 */
async function loadPageAsJsdomInstance(url, retriesCount = 1) {
  try {
    const res = await axios.get(url)
    const jsdom = new JSDOM(res.data)

    return jsdom
  } catch (err) {
    if (retriesCount === MAX_RETRIES_COUNT) {
      throw err
    }

    return loadPageAsJsdomInstance(url, retriesCount + 1)
  }
}

module.exports = { loadPageAsJsdomInstance }
