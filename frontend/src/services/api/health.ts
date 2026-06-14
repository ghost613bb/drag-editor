export interface HealthResponse {
  ok: boolean
  service: string
}

export async function fetchHealth() {
  const response = await fetch('/api/health')

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`)
  }

  return (await response.json()) as HealthResponse
}
