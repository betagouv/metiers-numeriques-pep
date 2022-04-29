/* eslint-disable sort-keys-fix/sort-keys-fix */

import { handleError } from '../helpers/handleError'

import type { Context } from 'koa'

export async function IndexController(ctx: Context) {
  try {
    ctx.body = {
      data: {
        routes: [
          {
            method: 'GET',
            path: '/offer-index',
            description: 'List offer indexes.',
          },
          {
            method: 'GET',
            path: '/status',
            description: 'Get jobs queue status.',
          },
        ],
      },
      hasError: false,
    }
  } catch (err) {
    handleError(err, 'controllers/IndexController()', ctx)
  }
}
