const { default: axios } = require('axios')

const { handleError } = require('./handleError.cjs')
const { sanitizeText } = require('./sanitizeText.cjs')

/**
 * @param {string} address
 *
 * @returns {Promise<Record<string, any> | undefined>}
 */
async function getBanAddressFromPepAddress(address) {
  try {
    const sanitizedAddress = sanitizeText(address.replace(/Localisation\s*:/i, ''))

    const url = `https://api-adresse.data.gouv.fr/search/?q=${sanitizedAddress}`
    const { data } = await axios.get(url)

    if (!Array.isArray(data.features)) {
      throw new Error(`Expected features to be an array, got ${data.features} instead.`)
    }
    if (data.features.length === 0) {
      throw new Error(`PEP Address "${address}" not found.`)
    }

    return data.features[0]
  } catch (err) {
    handleError(err, 'app/helpers/getAddressIdFromPepAddress()')
  }
}

module.exports = { getBanAddressFromPepAddress }
