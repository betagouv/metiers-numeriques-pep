/* eslint-disable sort-keys-fix/sort-keys-fix */

import { buildPrismaPaginationFilter } from '../helpers/buildPrismaPaginationFilter'
import { handleError } from '../helpers/handleError'
import { ApiError } from '../libs/ApiError'
import { prisma } from '../libs/prisma'

import type { Context } from 'koa'

export const OfferController = {
  list: async (ctx: Context) => {
    const SCRIPT_PATH = 'controllers/OfferController.list()'

    try {
      const { pageIndex, perPage } = ctx.query
      if (pageIndex === undefined) {
        return handleError(new ApiError('`pageIndex` query parameter is undefined.', 422, true), SCRIPT_PATH, ctx)
      }
      if (perPage === undefined) {
        return handleError(new ApiError('`perPage` query parameter is undefined.', 422, true), SCRIPT_PATH, ctx)
      }

      const paginationFilter = buildPrismaPaginationFilter(Number(perPage), Number(pageIndex))
      const offerIndexes = await prisma.offer.findMany({
        orderBy: {
          updatedAt: 'asc',
        },
        ...paginationFilter,
      })

      ctx.body = {
        data: offerIndexes,
        hasError: false,
      }
    } catch (err) {
      handleError(err, SCRIPT_PATH, ctx)
    }
  },
}
