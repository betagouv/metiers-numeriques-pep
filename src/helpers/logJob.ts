import { B } from 'bhala'

import type { JobType } from '../constants'
import type { JobId, JobStatus } from 'bull'

const SCRIPT_PATH = 'helpers/logJob.ts'

export function logJob(jobId: JobId, jobStatus: JobStatus, jobType: JobType) {
  const index = String(jobId).padStart(5, '0')
  const prefix = `[worker.ts] Job #${index} ${jobType}`

  switch (jobStatus) {
    case 'active':
      B.info(`${prefix} running...`)
      break

    case 'completed':
      B.success(`${prefix} done.`)
      break

    case 'failed':
      B.error(`${prefix} failed.`)
      break

    case 'waiting':
      B.info(`${prefix} queued.`)
      break

    default:
      B.error(`[${SCRIPT_PATH}] This should never happen.`)
  }
}
