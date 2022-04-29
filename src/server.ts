import KoaRouter from '@koa/router'
import { B } from 'bhala'
import Koa from 'koa'

import { IndexController } from './controllers/IndexControllers'
import { OfferIndexController } from './controllers/OfferIndexController'
import { StatusController } from './controllers/StatusController'
import { withError } from './middlewares/withError'

const { PORT } = process.env
if (PORT === undefined) {
  B.error('`PORT` environment variable is undefined.')
  process.exit(1)
}

const app = new Koa()
const router = new KoaRouter()

router.get('/', IndexController)
router.get('/status', StatusController)

router.get('/offer-index', OfferIndexController.list)

app.use(withError).use(router.routes()).use(router.allowedMethods()).listen(PORT)
