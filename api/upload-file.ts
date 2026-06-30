import crypto from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { file, fileName: originalName } = req.body
  if (!file) return res.status(400).json({ error: 'Missing file' })

  const fileName = originalName
    ? `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    : `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`

  try {
    const auth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')
    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, fileName, folder: '/', useUniqueFileName: true, tags: ['user-upload'] }),
    })
    const data = await uploadRes.json()
    if (data.url) return res.json({ url: data.url })
    return res.status(500).json({ error: data.message || 'Upload failed' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
