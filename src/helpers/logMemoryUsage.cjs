/* eslint-disable no-console */

const numeral = require('numeral')

const totalMemory = numeral(process.memoryUsage().heapTotal).format('0b')

/**
 * @param {string} scope
 * @param {string=} step
 */
function logMemoryUsage(scope, step) {
  const memoryUsage = process.memoryUsage()
  const usedMemory = numeral(memoryUsage.heapUsed).format('0b')

  if (step === undefined) {
    console.debug(`♻️ [${scope}] ${usedMemory} / ${totalMemory}.`)

    return
  }

  console.debug(`♻️ [${scope}] ${step} : ${usedMemory} / ${totalMemory}.`)
}

module.exports = { logMemoryUsage }
