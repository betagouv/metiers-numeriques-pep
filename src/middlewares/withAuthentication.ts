import { B } from 'bhala'

import { ApiError } from '../libs/ApiError'

import type { Context, Next } from 'koa'

const { API_SECRET, NODE_ENV } = process.env
if (API_SECRET === undefined) {
  B.error('`API_SECRET` environment variable is undefined.')
  process.exit(1)
}

const IS_PRODUCTION = NODE_ENV === 'production'

export async function withAuthentication(ctx: Context, next: Next) {
  const { 'x-api-secret': apiSecret } = ctx.headers

  if (!IS_PRODUCTION) {
    await next()

    return
  }

  if (typeof apiSecret !== 'string') {
    ctx.throw(new ApiError('Unauthorized.', 401, true))
  }

  if (apiSecret !== API_SECRET) {
    ctx.throw(new ApiError('Forbidden.', 403, true))
  }

  await next()
}
