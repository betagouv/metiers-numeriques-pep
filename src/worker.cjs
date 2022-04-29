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

const newPepOffersIndexingQueue = new Bull(JobType.INDEX_NEW_PEP_OFFERS, REDIS_URL)

const newPepOffersIndexinWorker = new Worker(require.resolve('./jobs/indexNewPepOffers.cjs'), {
  exposedMethods: ['indexNewPepOffers'],
  forkOptions: {
    silent: true,
  },
  numWorkers: 1,
})
newPepOffersIndexinWorker.getStdout().on('data', data => process.stdout.write(data))
newPepOffersIndexinWorker.getStderr().on('data', data => process.stderr.write(data))

async function start() {
  await newPepOffersIndexingQueue.clean(0)

  newPepOffersIndexingQueue.on('waiting', jobId => logJob(jobId, 'waiting', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('active', job => logJob(job.id, 'active', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('completed', job => logJob(job.id, 'completed', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.on('failed', job => logJob(job.id, 'failed', JobType.INDEX_NEW_PEP_OFFERS))
  newPepOffersIndexingQueue.process(MAX_NEW_PEP_OFFERS_INDEXING_JOBS_PER_WORKER, async () => {
    await newPepOffersIndexinWorker.indexNewPepOffers()
  })
}

start()
