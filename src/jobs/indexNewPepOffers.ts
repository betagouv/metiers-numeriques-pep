import { B } from 'bhala'

import { handleError } from '../helpers/handleError'
import { loadPageAsCheerioInstance } from '../helpers/loadPageAsCheerioInstance'
import { prisma } from '../libs/prisma'

import type { Job } from 'bull'
import type { Cheerio, CheerioAPI } from 'cheerio'

const BASE_URL = 'https://place-emploi-public.gouv.fr'
const MAX_PAGE_NUMBER = 20
const SCRIPT_PATH = 'jobs/indexNewPepOffers()'

const selectInOfferCard = ($root: CheerioAPI, index: number, selector: string): Cheerio<any> =>
  $root(`.fr-grid-row .fr-col-12:nth-child(${index + 1}) .card.card--offer ${selector}`)

export async function indexNewPepOffers(job: Job, pageIndex: number = 0): Promise<void> {
  try {
    const pageNumber = pageIndex + 1

    const $root = await loadPageAsCheerioInstance(`${BASE_URL}/nos-offres/filtres/domaine/3522/page/${pageNumber}`)
    const cheerioOfferList = $root('.js-results .fr-grid-row .card.card--offer')
    const cheerioOfferListLength = cheerioOfferList.length

    for (let index = 0; index < cheerioOfferList.length; index += 1) {
      const progressPercentage = Math.round(
        ((pageIndex * cheerioOfferListLength + index + 1) / (cheerioOfferListLength * MAX_PAGE_NUMBER)) * 100,
      )

      const sourceUrl = (selectInOfferCard($root, index, 'h3 a').attr('href') as string).trim()
      if (sourceUrl === undefined) {
        B.error(`[${SCRIPT_PATH}] \`sourceUrl\` is undefined.`)
        job.progress(progressPercentage)

        // eslint-disable-next-line no-continue
        continue
      }

      // eslint-disable-next-line no-await-in-loop
      const count = await prisma.offerIndex.count({
        where: {
          sourceUrl,
        },
      })
      if (count === 0) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.offerIndex.create({
          data: {
            sourceUrl,
          },
        })
      }

      job.progress(progressPercentage)
    }

    if (pageNumber === MAX_PAGE_NUMBER) {
      await prisma.$disconnect()

      return
    }

    return await indexNewPepOffers(job, pageIndex + 1)
  } catch (err) {
    handleError(err, SCRIPT_PATH)
  }
}
