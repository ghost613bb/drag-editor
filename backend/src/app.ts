import Koa from 'koa'
import { koaBody } from 'koa-body'
import { healthRouter } from './routes/health.js'

export function createApp() {
  const app = new Koa()

  app.use(koaBody())
  app.use(healthRouter.routes())
  app.use(healthRouter.allowedMethods())

  return app
}
