import type { PageSchema } from '@/types/schema'

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string }
    return body.message || fallback
  } catch {
    return fallback
  }
}

export async function loadSchema(id: string) {
  const response = await fetch(`/api/schema/${id}`)

  if (!response.ok) {
    const fallback = response.status === 404
      ? '尚未保存过该页面 Schema'
      : `Schema 恢复失败，状态码 ${response.status}`

    throw new Error(await readErrorMessage(response, fallback))
  }

  return (await response.json()) as PageSchema
}

export async function saveSchema(id: string, schema: PageSchema) {
  const response = await fetch(`/api/schema/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schema),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `Schema 保存失败，状态码 ${response.status}`))
  }

  return (await response.json()) as PageSchema
}
