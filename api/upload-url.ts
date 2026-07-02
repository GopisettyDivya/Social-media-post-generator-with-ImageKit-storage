import crypto from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'Missing url' })

  try {
    const auth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')
    const fileName = crypto.createHash('md5').update(url).digest('hex') + '.jpg'
    const form = new FormData()
    form.append('file', url)
    form.append('fileName', fileName)
    form.append('publicKey', process.env.IMAGEKIT_PUBLIC_KEY || '')
    form.append('useUniqueFileName', 'false')

    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}` },
      body: form,
    })
    const data = await uploadRes.json()
    if (data.url) return res.json({ success: true, imageKitUrl: data.url, fileId: data.fileId })
    return res.json({ success: false, error: data.message || 'Upload failed' })
  } catch (err: any) {
    return res.json({ success: false, error: err.message })
  }
}
