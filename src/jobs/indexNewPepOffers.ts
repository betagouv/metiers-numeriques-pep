/* eslint-disable no-await-in-loop, no-continue */

import { handleError } from '../helpers/handleError'
import { loadPageAsJsdomInstance } from '../helpers/loadPageAsJsdomInstance'
import { logMemoryUsage } from '../helpers/logMemoryUsage'
import { prisma } from '../libs/prisma'

import type { JSDOM } from 'jsdom'

const BASE_URL = 'https://place-emploi-public.gouv.fr'
const SCRIPT_PATH = 'jobs/indexNewPepOffers()'

const selectInOfferCard = (jsdom: JSDOM, index: number, selector: string): Element | null =>
  jsdom.window.document.querySelector(`.fr-grid-row .fr-col-12:nth-child(${index + 1}) .card.card--offer ${selector}`)

export async function indexNewPepOffers(): Promise<void> {
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
