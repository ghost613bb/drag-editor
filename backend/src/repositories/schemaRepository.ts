import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const schemaDir = path.resolve(process.cwd(), 'data/schemas')

function normalizeSchemaId(id: string) {
  return id.replace(/[^a-zA-Z0-9-_]/g, '-')
}

function getSchemaFilePath(id: string) {
  return path.join(schemaDir, `${normalizeSchemaId(id)}.json`)
}

export async function getSchema(id: string) {
  const filePath = getSchemaFilePath(id)

  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content) as unknown
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null
    }

    throw error
  }
}

export async function saveSchema(id: string, schema: unknown) {
  await mkdir(schemaDir, { recursive: true })

  const filePath = getSchemaFilePath(id)
  const content = JSON.stringify(schema, null, 2)

  await writeFile(filePath, `${content}\n`, 'utf-8')

  return schema
}
