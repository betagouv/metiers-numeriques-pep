const dayjs = require('dayjs')

const { sanitizeText } = require('./sanitizeText.cjs')

/**
 * @param {import('jsdom').JSDOM} jsdom
 *
 * @returns {Date}
 */
function extractPepOfferExpiredAt(jsdom) {
  const expiredAtFallback = dayjs().add(2, 'months').startOf('day').toDate()

  const $expiredAt = jsdom.window.document.querySelector('.ic.ic--info.fr-text--sm.tl-color--blue.fr-mb-0.fr-mt-2w')
  if ($expiredAt !== null && $expiredAt.textContent !== null) {
    const expirationDateAsFrenchDate = sanitizeText($expiredAt.textContent).replace(
      /Date\s+limite\s+de\s+candidature\s*:\s*/i,
      '',
    )
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(expirationDateAsFrenchDate)) {
      const matches = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(expirationDateAsFrenchDate)
      if (matches !== null && matches.length === 4) {
        return dayjs(`${matches[3]}-${matches[2]}-${matches[1]}`).startOf('day').toDate()
      }

      return expiredAtFallback
    }

    return expiredAtFallback
  }

  return expiredAtFallback
}

module.exports = { extractPepOfferExpiredAt }
