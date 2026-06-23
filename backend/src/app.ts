import Koa from 'koa'
import { koaBody } from 'koa-body'
import { healthRouter } from './routes/health.js'
import { schemaRouter } from './routes/schema.js'

export function createApp() {
  const app = new Koa()

  app.use(koaBody())
  app.use(healthRouter.routes())
  app.use(healthRouter.allowedMethods())
  app.use(schemaRouter.routes())
  app.use(schemaRouter.allowedMethods())

  return app
}
