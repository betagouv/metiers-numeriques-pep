/* eslint-disable sort-keys-fix/sort-keys-fix */

import { handleError } from '../helpers/handleError'

import type { Context } from 'koa'

const { npm_package_version: VERSION } = process.env

export async function IndexController(ctx: Context) {
  try {
    ctx.body = {
      data: {
        routes: [
          {
            method: 'GET',
            path: '/offer-indexes',
            description: 'List scrapped PEP offer indexes.',
          },
          {
            method: 'GET',
            path: '/offers',
            description: 'List scrapped PEP offers.',
          },
          {
            method: 'GET',
            path: '/status',
            description: 'Get jobs queue status.',
          },
        ],
        version: VERSION,
      },
      hasError: false,
    }
  } catch (err) {
    handleError(err, 'controllers/IndexController()', ctx)
  }
}
