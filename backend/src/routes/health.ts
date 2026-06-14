import Router from '@koa/router'

export const healthRouter = new Router()

healthRouter.get('/api/health', (ctx) => {
  ctx.body = {
    ok: true,
    service: 'drag-editor-backend',
  }
})
