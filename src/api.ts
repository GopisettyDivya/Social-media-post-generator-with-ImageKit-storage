const STORAGE_KEY = 'social-posts-history'

export interface HistorySummary {
  id: number
  image_url: string
  brand_context: string
  result: string
  created_at: string
}

function loadAll(): HistorySummary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(items: HistorySummary[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getHistory(): HistorySummary[] {
  return loadAll()
}

export function getPost(id: number): HistorySummary {
  const item = loadAll().find(i => i.id === id)
  if (!item) throw new Error('Not found')
  return item
}

export function savePost(image_url: string, brand_context: string, result: string): { id: number; created_at: string } {
  const items = loadAll()
  const existing = items.find(i => i.image_url === image_url)
  if (existing) return { id: existing.id, created_at: existing.created_at }
  const entry: HistorySummary = {
    id: Date.now(),
    image_url,
    brand_context,
    result,
    created_at: new Date().toISOString(),
  }
  items.unshift(entry)
  saveAll(items)
  return { id: entry.id, created_at: entry.created_at }
}

export function removePost(id: number): void {
  saveAll(loadAll().filter(i => i.id !== id))
}
