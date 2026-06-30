import 'dotenv/config'
import express from 'express'
import crypto from 'crypto'

const app = express()
app.use(express.json({ limit: '10mb' }))
const PORT = 3001

app.post('/api/upload-url', async (req, res) => {
  const { url, folder } = req.body
  if (!url) return res.status(400).json({ error: 'Missing url' })
  try {
    const fileName = crypto.createHash('md5').update(url).digest('hex')
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!resp.ok) return res.status(400).json({ error: 'Failed to download image' })
    const imageBuf = await resp.arrayBuffer()
    const base64 = Buffer.from(imageBuf).toString('base64')
    const auth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')
    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: base64, fileName, folder: folder || '/', useUniqueFileName: false, tags: ['social-post'] }),
    })
    const data = await uploadRes.json()
    if (data.url) return res.json({ success: true, imageKitUrl: data.url, fileId: data.fileId })
    return res.json({ success: false, error: data.message || 'Upload failed' })
  } catch (err: any) {
    return res.json({ success: false, error: err.message })
  }
})

app.post('/api/upload-file', async (req, res) => {
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
})

app.listen(PORT, () => {
  console.log(`Dev server running on http://localhost:${PORT}`)
})
