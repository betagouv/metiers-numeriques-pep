import { B } from 'bhala'
import Bull from 'bull'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Worker as JestWorker } from 'jest-worker'

import { JobType } from './constants'
import { logJob } from './helpers/logJob'
import { indexNewPepOffers } from './jobs/indexNewPepOffers'

const { REDIS_URL } = process.env
if (REDIS_URL === undefined) {
  B.error('`PORT` environment variable is undefined.')
  process.exit(1)
}

const MAX_NEW_PEP_JOBS_INDEXING_JOBS_PER_WORKER = 1

const newPepOffersIndexingQueue = new Bull(JobType.INDEX_NEW_PEP_OFFERS, REDIS_URL)

newPepOffersIndexingQueue.process(MAX_NEW_PEP_JOBS_INDEXING_JOBS_PER_WORKER, indexNewPepOffers)
newPepOffersIndexingQueue.on('waiting', jobId => logJob(jobId, 'waiting', JobType.INDEX_NEW_PEP_OFFERS))
newPepOffersIndexingQueue.on('active', job => logJob(job.id, 'active', JobType.INDEX_NEW_PEP_OFFERS))
newPepOffersIndexingQueue.on('completed', job => logJob(job.id, 'completed', JobType.INDEX_NEW_PEP_OFFERS))
newPepOffersIndexingQueue.on('failed', job => logJob(job.id, 'failed', JobType.INDEX_NEW_PEP_OFFERS))
