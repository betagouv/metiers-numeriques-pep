import { B } from 'bhala'
import Bull from 'bull'
import { CronJob } from 'cron'

import { JobType } from './constants'

import type { CronJobParameters } from 'cron'

const { REDIS_URL } = process.env
if (REDIS_URL === undefined) {
  B.error('`PORT` environment variable is undefined.')
  process.exit(1)
}

const COMMON_CRON_JOB_OPTIONS: Partial<CronJobParameters> = {
  onComplete: null,
  runOnInit: true,
  start: false,
  timeZone: 'Europe/Paris',
}
const SCRIPT_PATH = 'cron.ts'

const newPepOffersIndexingQueue = new Bull(JobType.INDEX_NEW_PEP_OFFERS, REDIS_URL)
const newPepOfferProcessingQueue = new Bull(JobType.PROCESS_NEW_PEP_OFFER, REDIS_URL)

const newPepOffersIndexingCronJob = new CronJob({
  ...COMMON_CRON_JOB_OPTIONS,
  // At every 5th minute
  cronTime: '*/5 * * * *',
  onTick: async () => {
    B.info(`[${SCRIPT_PATH}] Adding ${JobType.INDEX_NEW_PEP_OFFERS} job...`)

    await newPepOffersIndexingQueue.add(null)

    B.success(`[${SCRIPT_PATH}] ${JobType.INDEX_NEW_PEP_OFFERS} job added.`)
  },
})

const newPepOffersProcessingCronJob = new CronJob({
  ...COMMON_CRON_JOB_OPTIONS,
  // At every minute
  cronTime: '* * * * *',
  onTick: async () => {
    B.info(`[${SCRIPT_PATH}] Adding ${JobType.PROCESS_NEW_PEP_OFFER} job...`)

    await newPepOfferProcessingQueue.add(null)

    B.success(`[${SCRIPT_PATH}] ${JobType.PROCESS_NEW_PEP_OFFER} job added.`)
  },
})

newPepOffersIndexingCronJob.start()
newPepOffersProcessingCronJob.start()
