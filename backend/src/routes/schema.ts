import Router from '@koa/router'
import { getSchema, saveSchema } from '../repositories/schemaRepository.js'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidPageSchema(value: unknown) {
  if (!isObject(value)) {
    return false
  }

  if (typeof value.version !== 'number') {
    return false
  }

  if (!isObject(value.pageMeta)) {
    return false
  }

  if (!isObject(value.root)) {
    return false
  }

  return value.root.type === 'container'
}

export const schemaRouter = new Router()

schemaRouter.get('/api/schema/:id', async (ctx) => {
  const schema = await getSchema(ctx.params.id)

  if (!schema) {
    ctx.status = 404
    ctx.body = {
      message: 'Schema not found',
    }
    return
  }

  ctx.body = schema
})

schemaRouter.put('/api/schema/:id', async (ctx) => {
  const schema = ctx.request.body

  if (!isValidPageSchema(schema)) {
    ctx.status = 400
    ctx.body = {
      message: 'Invalid page schema',
    }
    return
  }

  const savedSchema = await saveSchema(ctx.params.id, schema)

  ctx.body = savedSchema
})
