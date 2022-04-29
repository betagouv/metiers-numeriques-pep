/* eslint-disable no-console */

const SCRIPT_PATH = 'helpers/logJob.cjs'

/**
 * @param {number} jobId
 * @param {import('bull').JobStatus} jobStatus
 * @param {string} jobType
 */
function logJob(jobId, jobStatus, jobType) {
  const index = String(jobId).padStart(5, '0')
  const prefix = `[worker.ts] Job #${index} ${jobType}`

  switch (jobStatus) {
    case 'active':
      console.info(`ℹ️ ${prefix} running...`)
      break

    case 'completed':
      console.info(`✅ ${prefix} done.`)
      break

    case 'failed':
      console.error(`❌ ${prefix} failed.`)
      break

    case 'waiting':
      console.info(`ℹ️ ${prefix} queued.`)
      break

    default:
      console.error(`❌ [${SCRIPT_PATH}] This should never happen.`)
  }
}

module.exports = { logJob }
