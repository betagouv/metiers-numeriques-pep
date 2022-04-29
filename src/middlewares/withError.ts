import type { Context, Next } from 'koa'

export async function withError(ctx: Context, next: Next) {
  return next().catch(err => {
    const { message, statusCode } = err

    ctx.type = 'json'
    ctx.status = statusCode || 500
    ctx.body =
      err !== undefined && err.hasError === true
        ? err
        : {
            hasError: true,
            message,
          }

    ctx.app.emit('error', err, ctx)
  })
}
