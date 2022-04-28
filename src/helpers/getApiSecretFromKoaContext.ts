import { handleError } from './handleError'

import type { Context } from 'koa'

export function getApiSecretFromKoaContext(ctx: Context): string | undefined {
  try {
    const { 'x-api-secret': apiSecret } = ctx.headers

    if (typeof apiSecret !== 'string') {
      return undefined
    }

    return apiSecret
  } catch (err) {
    handleError(err, 'helpers/getApiSecretFromKoaContext()', true)
  }
}
