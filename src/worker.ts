import Bull from 'bull'

import { JobType } from './constants'
import { logJob } from './helpers/logJob'
import { indexNewPepOffers } from './jobs/indexNewPepOffers'
import { processNewPepOffer } from './jobs/processNewPepOffer'

const { REDIS_URL } = process.env
if (REDIS_URL === undefined) {
  // eslint-disable-next-line no-console
  console.error('`PORT` environment variable is undefined.')
  process.exit(1)
}

const MAX_NEW_PEP_OFFERS_INDEXING_JOBS_PER_WORKER = 1
const MAX_NEW_PEP_OFFER_PROCESSING_JOBS_PER_WORKER = 1

const newPepOffersIndexingQueue = new Bull(JobType.INDEX_NEW_PEP_OFFERS, REDIS_URL)
const newPepOfferProcessingQueue = new Bull(JobType.PROCESS_NEW_PEP_OFFER, REDIS_URL)

async function start() {
  await newPepOffersIndexingQueue.clean(0)
  await newPepOfferProcessingQueue.clean(0)

  newPepOffersIndexingQueue.on('waiting', jobId => logJob(jobId, 'waiting', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('active', job => logJob(job.id, 'active', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('completed', job => logJob(job.id, 'completed', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('failed', (job, err) => {
    logJob(job.id, 'failed', JobType.INDEX_NEW_PEP_OFFERS)
    // eslint-disable-next-line no-console
    console.error(err)
  })
  newPepOffersIndexingQueue.process(MAX_NEW_PEP_OFFERS_INDEXING_JOBS_PER_WORKER, indexNewPepOffers)

  newPepOfferProcessingQueue.on('waiting', jobId => logJob(jobId, 'waiting', JobType.PROCESS_NEW_PEP_OFFER))
  newPepOfferProcessingQueue.on('active', job => logJob(job.id, 'active', JobType.PROCESS_NEW_PEP_OFFER))
  newPepOfferProcessingQueue.on('completed', job => logJob(job.id, 'completed', JobType.PROCESS_NEW_PEP_OFFER))
  newPepOfferProcessingQueue.on('failed', (job, err) => {
    logJob(job.id, 'failed', JobType.PROCESS_NEW_PEP_OFFER)
    // eslint-disable-next-line no-console
    console.error(err)
  })
  newPepOfferProcessingQueue.process(MAX_NEW_PEP_OFFER_PROCESSING_JOBS_PER_WORKER, processNewPepOffer)
}

start()
