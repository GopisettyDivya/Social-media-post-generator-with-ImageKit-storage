import crypto from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const IMAGE_AGENT_URL = process.env.VITE_IMAGE_AGENT_URL || 'https://image-agent-385902914959.us-central1.run.app'
const IMAGE_AGENT_KEY = process.env.VITE_IMAGE_AGENT_API_KEY || ''

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = new URL(req.url || '/', 'http://localhost').pathname

  if (req.method === 'POST' && path === '/api/create_social_post') {
    try {
      const agentRes = await fetch(`${IMAGE_AGENT_URL}/create_social_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': IMAGE_AGENT_KEY,
        },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(180000),
      })
      const text = await agentRes.text()
      res.status(agentRes.status).send(text)
    } catch (err: any) {
      res.status(502).json({ error: `Image Agent request failed: ${err.message}` })
    }
    return
  }

  if (req.method === 'POST' && path === '/api/upload-to-imagekit') {
    try {
      const { url, folder } = req.body
      if (!url) return res.status(400).json({ error: 'Missing url' })
      const fileName = crypto.createHash('md5').update(url).digest('hex')
      const resp = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (!resp.ok) return res.status(400).json({ error: 'Failed to download image' })
      const imageBuf = await resp.arrayBuffer()
      const base64 = Buffer.from(imageBuf).toString('base64')
      const auth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')
      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          fileName,
          folder: folder || '/',
          useUniqueFileName: false,
          tags: ['social-post'],
        }),
      })
      const data = await uploadRes.json()
      if (data.url) return res.json({ success: true, imageKitUrl: data.url, fileId: data.fileId })
      return res.json({ success: false, error: data.message || 'Upload failed', detail: data })
    } catch (err: any) {
      return res.json({ success: false, error: err.message })
    }
  }

  if (path === '/api/imagekit-auth') {
    const token = crypto.randomUUID()
    const expire = Math.floor(Date.now() / 1000) + 3600
    const signature = crypto.createHmac('sha1', process.env.IMAGEKIT_PRIVATE_KEY || '')
      .update(token + expire)
      .digest('hex')
    return res.json({ token, expire, publicKey: process.env.IMAGEKIT_PUBLIC_KEY, signature })
  }

  res.status(404).json({ error: 'Not found' })
}
