import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = new URL(req.url || '/', 'http://localhost').pathname

  if (req.method === 'POST' && path === '/api/create_social_post') {
    const agentUrl = process.env.IMAGE_AGENT_URL || process.env.VITE_IMAGE_AGENT_URL || 'https://image-agent-385902914959.us-central1.run.app'
    const agentKey = process.env.IMAGE_AGENT_API_KEY || process.env.VITE_IMAGE_AGENT_API_KEY || ''
    try {
      const agentRes = await fetch(`${agentUrl}/create_social_post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': agentKey },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(120000),
      })
      const text = await agentRes.text()
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(agentRes.status).send(text)
    } catch (err: any) {
      res.status(502).json({ error: err.message })
    }
    return
  }

  res.status(404).json({ error: 'Not found' })
}
