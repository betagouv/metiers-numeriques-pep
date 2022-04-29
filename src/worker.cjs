const Bull = require('bull')
const { Worker } = require('jest-worker')

const { JobType } = require('./constants.cjs')
const { logJob } = require('./helpers/logJob.cjs')

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

const newPepOffersIndexingWorker = new Worker(require.resolve('./jobs/indexNewPepOffers.cjs'), {
  exposedMethods: ['indexNewPepOffers'],
  forkOptions: {
    silent: true,
  },
  numWorkers: 1,
})
newPepOffersIndexingWorker.getStdout().on('data', data => process.stdout.write(data))
newPepOffersIndexingWorker.getStderr().on('data', data => process.stderr.write(data))

const newPepOfferProcessingWorker = new Worker(require.resolve('./jobs/processNewPepOffer.cjs'), {
  exposedMethods: ['processNewPepOffer'],
  forkOptions: {
    silent: true,
  },
  numWorkers: 1,
})
newPepOfferProcessingWorker.getStdout().on('data', data => process.stdout.write(data))
newPepOfferProcessingWorker.getStderr().on('data', data => process.stderr.write(data))

async function start() {
  await newPepOffersIndexingQueue.clean(0)
  await newPepOfferProcessingQueue.clean(0)

  newPepOffersIndexingQueue.on('waiting', jobId => logJob(jobId, 'waiting', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('active', job => logJob(job.id, 'active', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('completed', job => logJob(job.id, 'completed', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('failed', job => logJob(job.id, 'failed', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.process(MAX_NEW_PEP_OFFERS_INDEXING_JOBS_PER_WORKER, async () => {
    await newPepOffersIndexingWorker.indexNewPepOffers()
  })

  newPepOfferProcessingQueue.on('waiting', jobId => logJob(jobId, 'waiting', JobType.PROCESS_NEW_PEP_OFFER))
  newPepOfferProcessingQueue.on('active', job => logJob(job.id, 'active', JobType.PROCESS_NEW_PEP_OFFER))
  newPepOfferProcessingQueue.on('completed', job => logJob(job.id, 'completed', JobType.PROCESS_NEW_PEP_OFFER))
  newPepOfferProcessingQueue.on('failed', job => logJob(job.id, 'failed', JobType.PROCESS_NEW_PEP_OFFER))
  newPepOfferProcessingQueue.process(MAX_NEW_PEP_OFFER_PROCESSING_JOBS_PER_WORKER, async () => {
    await newPepOfferProcessingWorker.processNewPepOffer()
  })
}

start()
