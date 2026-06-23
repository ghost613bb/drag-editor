import type { PageSchema } from '@/types/schema'

function buildExportFileName(schema: PageSchema) {
  const safeTitle = schema.pageMeta.title.replace(/[^一-龥a-zA-Z0-9-_]/g, '-')
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  return `${safeTitle || schema.pageMeta.id}-${timestamp}.json`
}

export function exportPageSchemaAsJson(schema: PageSchema) {
  const content = JSON.stringify(schema, null, 2)
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = buildExportFileName(schema)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
