/* eslint-disable no-await-in-loop, no-continue */

const { OfferIndexStatus } = require('@prisma/client')

const { convertHtmlToMarkdown } = require('../helpers/convertHtmlToMarkdown.cjs')
const { extractPepChapterFromMainContent } = require('../helpers/extractPepChapterFromMainContent.cjs')
const { extractPepOfferExpiredAt } = require('../helpers/extractPepOfferExpiredAt.cjs')
const { findJsdomElementContainingText } = require('../helpers/findJsdomElementContainingText.cjs')
const { getBanAddressFromPepAddress } = require('../helpers/getBanAddressFromPepAddress.cjs')
const { handleError } = require('../helpers/handleError.cjs')
const { loadPageAsJsdomInstance } = require('../helpers/loadPageAsJsdomInstance.cjs')
const { logMemoryUsage } = require('../helpers/logMemoryUsage.cjs')
const { sanitizeHtml } = require('../helpers/sanitizeHtml.cjs')
const { sanitizeText } = require('../helpers/sanitizeText.cjs')
const { prisma } = require('../libs/prisma.cjs')

const SCRIPT_PATH = 'jobs/processNewPepOffer()'

async function processNewPepOffer() {
  try {
    const pendingOfferIndex = await prisma.offerIndex.findFirst({
      where: {
        status: OfferIndexStatus.PENDING,
      },
    })
    if (pendingOfferIndex === null) {
      // eslint-disable-next-line no-console
      console.info(`[${SCRIPT_PATH}] ℹ️ No Offer Index to process.`)

      return
    }

    await prisma.offerIndex.update({
      data: {
        status: OfferIndexStatus.PROCESSING,
      },
      where: {
        id: pendingOfferIndex.id,
      },
    })

    /** @type {import('@prisma/client').Offer} */
    const newOffer = {
      sourceUrl: pendingOfferIndex.sourceUrl,
    }

    const jsdom = await loadPageAsJsdomInstance(newOffer.sourceUrl)

    const $title = jsdom.window.document.querySelector('h1')
    if ($title === null) {
      throw new Error(`Unable to find title at ${newOffer.sourceUrl}.`)
    }
    newOffer.title = sanitizeText($title.textContent)

    const $missionDescriptionTitle = findJsdomElementContainingText(jsdom, 'h2', 'Vos missions en quelques mots')
    if ($missionDescriptionTitle === null) {
      throw new Error(`Unable to find mission description at ${newOffer.sourceUrl}.`)
    }

    const $mainContent = $missionDescriptionTitle.parentElement
    if ($mainContent === null) {
      throw new Error(`Unable to find mission description parent at ${newOffer.sourceUrl}.`)
    }
    const mainContentAsHtml = $mainContent.innerHTML

    const missionDescriptionAsHtml = extractPepChapterFromMainContent(
      mainContentAsHtml,
      'Vos missions en quelques mots',
    )
    if (missionDescriptionAsHtml === undefined) {
      throw new Error(`Unable to extract mission description at ${newOffer.sourceUrl}.`)
    }
    newOffer.missionDescriptionAsHtml = sanitizeHtml(missionDescriptionAsHtml)
    newOffer.missionDescriptionAsMarkdown = convertHtmlToMarkdown(newOffer.missionDescriptionAsHtml)

    const profileDescriptionAsHtml = extractPepChapterFromMainContent(mainContentAsHtml, 'Profil recherché')
    if (profileDescriptionAsHtml !== undefined) {
      newOffer.profileDescriptionAsHtml = sanitizeHtml(profileDescriptionAsHtml)
      newOffer.profileDescriptionAsMarkdown = convertHtmlToMarkdown(newOffer.profileDescriptionAsHtml)
    }

    const $teamDescriptionTitle = findJsdomElementContainingText(jsdom, 'h2', 'Qui sommes nous ?')
    if ($teamDescriptionTitle === null || $teamDescriptionTitle.parentElement.nextElementSibling === null) {
      throw new Error(`Unable to find team description at ${newOffer.sourceUrl}.`)
    }
    const teamDescriptionAsHtml = $teamDescriptionTitle.parentElement.nextElementSibling.innerHTML.trim()
    newOffer.teamDescriptionAsHtml = sanitizeHtml(teamDescriptionAsHtml)
    newOffer.teamDescriptionAsMarkdown = convertHtmlToMarkdown(newOffer.teamDescriptionAsHtml)

    const $pepProfession = findJsdomElementContainingText(jsdom, 'button', 'Métier référence')
    if (
      $pepProfession === null ||
      $pepProfession.parentElement.nextElementSibling === null ||
      $pepProfession.parentElement.nextElementSibling.textContent === null
    ) {
      throw new Error(`Unable to find PEP profession at ${newOffer.sourceUrl}.`)
    }
    newOffer.professionLabel = sanitizeText($pepProfession.parentElement.nextElementSibling.textContent)

    newOffer.expiredAt = extractPepOfferExpiredAt(jsdom)

    const $recruiterName = jsdom.window.document.querySelector('ul.fr-grid-row > li:nth-child(2)')
    if ($recruiterName === null || $recruiterName.textContent === null) {
      throw new Error(`Unable to find recuiter name at ${newOffer.sourceUrl}.`)
    }
    newOffer.recruiterName = sanitizeText($recruiterName.textContent.replace(/employeur\s*:/i, ''))

    const $address = jsdom.window.document.querySelector('ul.fr-grid-row > li:nth-child(3)')
    if ($address !== null && $address.textContent !== null) {
      const address = await getBanAddressFromPepAddress($address.textContent)

      if (address !== undefined) {
        newOffer.address = address
      }
    }

    await prisma.offer.create({
      data: newOffer,
    })

    await prisma.offerIndex.update({
      data: {
        status: OfferIndexStatus.PROCESSED,
      },
      where: {
        id: pendingOfferIndex.id,
      },
    })

    await prisma.$disconnect()

    logMemoryUsage(SCRIPT_PATH)
  } catch (err) {
    handleError(err, SCRIPT_PATH)
  }
}

module.exports = { processNewPepOffer }
