import { B } from 'bhala'
import Bull from 'bull'

import { JobType } from '../constants'
import { handleError } from '../helpers/handleError'

import type { Context } from 'koa'

const { REDIS_URL } = process.env
if (REDIS_URL === undefined) {
  B.error('`PORT` environment variable is undefined.')
  process.exit(1)
}

const newPepOffersIndexingQueue = new Bull(JobType.INDEX_NEW_PEP_OFFERS, REDIS_URL)

export async function StatusController(ctx: Context) {
  try {
    const newPepOffersIndexingCount = await newPepOffersIndexingQueue.count()
    const newPepOffersIndexingInProgress = await newPepOffersIndexingQueue.getActive()
    const newPepOffersIndexingQueued = await newPepOffersIndexingQueue.getWaiting()

    ctx.body = {
      data: {
        newPepOffersIndexing: {
          count: newPepOffersIndexingCount,
          inProgress: newPepOffersIndexingInProgress,
          queued: newPepOffersIndexingQueued,
        },
      },
      hasError: false,
    }
  } catch (err) {
    handleError(err, 'controllers/StatusController()', ctx)
  }
}
