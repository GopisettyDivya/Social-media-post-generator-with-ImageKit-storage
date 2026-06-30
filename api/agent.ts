import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const path = new URL(req.url || '/', 'http://localhost').pathname

  if (req.method === 'POST' && path === '/api/create_social_post') {
    const agentUrl = process.env.IMAGE_AGENT_URL || process.env.VITE_IMAGE_AGENT_URL || 'https://image-agent-385902914959.us-central1.run.app'
    const agentKey = process.env.IMAGE_AGENT_API_KEY || process.env.VITE_IMAGE_AGENT_API_KEY || ''
    try {
      const agentRes = await fetch(`${agentUrl}/create_social_post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': agentKey },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(9500),
      })
      const text = await agentRes.text()
      res.status(agentRes.status).send(text)
    } catch (err: any) {
      if (err.name === 'TimeoutError' || err.message?.includes('timed out')) {
        res.status(503).json({ error: 'still_warming', message: 'API is cold-starting, please retry' })
      } else {
        res.status(502).json({ error: err.message })
      }
    }
    return
  }

  res.status(404).json({ error: 'Not found' })
}
