export interface HistorySummary {
  id: number
  image_url: string
  brand_context: string
  created_at: string
}

export interface HistoryDetail {
  id: number
  image_url: string
  brand_context: string
  result: string
  created_at: string
}

export async function getHistory(): Promise<HistorySummary[]> {
  const res = await fetch('/api/history')
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function getPost(id: number): Promise<HistoryDetail> {
  const res = await fetch(`/api/history/${id}`)
  if (!res.ok) throw new Error('Post not found')
  return res.json()
}

export async function savePost(image_url: string, brand_context: string, result: string) {
  const res = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url, brand_context, result }),
  })
  if (!res.ok) throw new Error('Failed to save post')
  return res.json() as Promise<{ id: number; created_at: string }>
}

export async function removePost(id: number) {
  const res = await fetch(`/api/history/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete post')
}
