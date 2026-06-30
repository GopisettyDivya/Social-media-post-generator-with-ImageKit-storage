import crypto from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { url, folder } = req.body
  if (!url) return res.status(400).json({ error: 'Missing url' })

  try {
    const ext = url.match(/\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?|$)/i)?.[1] || 'jpg'
    const fileName = `${crypto.createHash('md5').update(url).digest('hex')}.${ext}`
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!resp.ok) return res.status(400).json({ error: 'Failed to download image' })
    const imageBuf = await resp.arrayBuffer()
    const base64 = Buffer.from(imageBuf).toString('base64')
    const auth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')
    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: base64, fileName, folder: folder || '/', publicKey: process.env.IMAGEKIT_PUBLIC_KEY, useUniqueFileName: true, tags: ['social-post'] }),
    })
    const data = await uploadRes.json()
    if (data.url) return res.json({ success: true, imageKitUrl: data.url, fileId: data.fileId })
    return res.json({ success: false, error: data.message || 'Upload failed' })
  } catch (err: any) {
    return res.json({ success: false, error: err.message })
  }
}
