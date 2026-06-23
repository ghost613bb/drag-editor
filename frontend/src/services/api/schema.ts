import type { PageSchema } from '@/types/schema'

export async function loadSchema(id: string) {
  const response = await fetch(`/api/schema/${id}`)

  if (!response.ok) {
    throw new Error(`Load schema failed with status ${response.status}`)
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
    throw new Error(`Save schema failed with status ${response.status}`)
  }

  return (await response.json()) as PageSchema
}
