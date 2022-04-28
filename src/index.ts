import { B } from 'bhala'
import Koa from 'koa'

import type { Context } from 'koa'

const { PORT } = process.env
if (PORT === undefined) {
  B.error('`PORT` environment variable is undefined.')
  process.exit(1)
}

const app = new Koa()

app.use(async (ctx: Context) => {
  ctx.body = {
    message: 'Hello World!',
  }
})

app.listen(PORT)
