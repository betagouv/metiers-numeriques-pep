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

const SCRIPT_PATH = 'cron.ts'

const newPepOffersIndexingQueue = new Bull(JobType.INDEX_NEW_PEP_OFFERS, REDIS_URL)

const commonCronJobOptions: Partial<CronJobParameters> = {
  onComplete: null,
  runOnInit: true,
  start: false,
  timeZone: 'Europe/Paris',
}

const newPepOffersIndexingCronJob = new CronJob({
  ...commonCronJobOptions,
  // At every 20th minute
  cronTime: '*/20 * * * *',
  onTick: async () => {
    B.info(`[${SCRIPT_PATH}] Adding ${JobType.INDEX_NEW_PEP_OFFERS} job...`)

    await newPepOffersIndexingQueue.add(null)

    B.success(`[${SCRIPT_PATH}] ${JobType.INDEX_NEW_PEP_OFFERS} job added.`)
  },
})

newPepOffersIndexingCronJob.start()
