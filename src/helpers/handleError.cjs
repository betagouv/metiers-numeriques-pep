/* eslint-disable no-console */

/**
 * @param {*} error
 *
 * @returns {string}
 */
const getErrorConstructorName = error => {
  if (error === undefined || error.constructor === undefined) {
    return 'undefined'
  }

  return error.constructor.name
}

/**
 * @param {*} error
 * @param {string} path
 * @param {boolean=} isFinal
 *
 * @returns {void}
 */
function handleError(error, path, isFinal = false) {
  let errorString
  switch (true) {
    case typeof error === 'string':
      errorString = error
      break

    case error instanceof Error:
      errorString = error.message
      break

    default:
      // eslint-disable-next-line no-case-declarations
      console.error(
        `❌ [common/helpers/handleError()] This type of error cannot be processed. This should never happen.`,
      )
      console.error(`❌ [common/helpers/handleError()] Error Type: ${typeof error}`)
      console.error(`❌ [common/helpers/handleError()] Error Constructor: ${getErrorConstructorName(error)}`)
      errorString = String(error)
  }

  console.error(`❌ [${path}] ${errorString}`)
  console.error(error)

  if (isFinal === true) {
    return process.exit(1)
  }
}

module.exports = { handleError }
