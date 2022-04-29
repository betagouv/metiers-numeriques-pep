/* eslint-disable no-await-in-loop, no-continue */

const { handleError } = require('../helpers/handleError.cjs')
const { loadPageAsJsdomInstance } = require('../helpers/loadPageAsJsdomInstance.cjs')
const { logMemoryUsage } = require('../helpers/logMemoryUsage.cjs')
const { prisma } = require('../libs/prisma.cjs')

const BASE_URL = 'https://place-emploi-public.gouv.fr'
const SCRIPT_PATH = 'jobs/indexNewPepOffers()'

/**
 * @param {import('jsdom').JSDOM} jsdom
 * @param {number} index
 * @param {string} selector
 *
 * @returns {Element | null}
 */
const selectInOfferCard = (jsdom, index, selector) =>
  jsdom.window.document.querySelector(`.fr-grid-row .fr-col-12:nth-child(${index + 1}) .card.card--offer ${selector}`)

async function indexNewPepOffers() {
  try {
    const jsdom = await loadPageAsJsdomInstance(`${BASE_URL}/nos-offres/filtres/domaine/3522/page/1`)

    const $offerList = jsdom.window.document.querySelectorAll('.js-results .fr-grid-row .card.card--offer')
    // logMemoryUsage(SCRIPT_PATH, 'After `$offerList` assignment.')

    const offerListLength = $offerList.length

    for (let index = 0; index < offerListLength; index += 1) {
      // const progressPercentage = Math.round(((index + 1) / $offerListLength) * 100)

      const $sourceUrl = selectInOfferCard(jsdom, index, 'h3 a')
      if ($sourceUrl === null) {
        throw new Error(`Could not find $sourceUrl in offer card ${index}.`)
      }

      const sourceUrlHref = $sourceUrl.getAttribute('href')
      if (sourceUrlHref === null) {
        throw new Error(`Could not find $sourceUrl {href} in offer card ${index}.`)
      }

      const sourceUrl = sourceUrlHref.trim()

      if (sourceUrl === undefined) {
        // eslint-disable-next-line no-console
        console.error(`[${SCRIPT_PATH}] \`sourceUrl\` is undefined.`)
        // await job.progress(progressPercentage)

        continue
      }

      const count = await prisma.offerIndex.count({
        where: {
          sourceUrl,
        },
      })
      if (count === 0) {
        await prisma.offerIndex.create({
          data: {
            sourceUrl,
          },
        })
      }

      // await job.progress(progressPercentage)
    }

    await prisma.$disconnect()

    logMemoryUsage(SCRIPT_PATH)
  } catch (err) {
    handleError(err, SCRIPT_PATH)
  }
}

module.exports = { indexNewPepOffers }
