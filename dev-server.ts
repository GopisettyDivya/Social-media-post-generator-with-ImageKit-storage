import 'dotenv/config'
import express from 'express'
import crypto from 'crypto'

const app = express()
app.use(express.json({ limit: '10mb' }))

const PORT = 3001
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || ''
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || ''

app.get('/api/imagekit-auth', (_req, res) => {
  const token = crypto.randomUUID()
  const expire = Math.floor(Date.now() / 1000) + 3600
  const signature = crypto.createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest('hex')
  res.json({ token, expire, publicKey: IMAGEKIT_PUBLIC_KEY, signature })
})

app.post('/api/upload-to-imagekit', async (req, res) => {
  try {
    const { url, folder } = req.body
    if (!url) return res.status(400).json({ error: 'Missing url' })
    const fileName = crypto.createHash('md5').update(url).digest('hex')
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!resp.ok) return res.status(400).json({ error: 'Failed to download image' })
    const imageBuf = await resp.arrayBuffer()
    const base64 = Buffer.from(imageBuf).toString('base64')
    const auth = Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64')
    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: base64, fileName, folder: folder || '/', useUniqueFileName: false, tags: ['social-post'] }),
    })
    const data = await uploadRes.json()
    if (data.url) return res.json({ success: true, imageKitUrl: data.url, fileId: data.fileId })
    return res.json({ success: false, error: data.message || 'Upload failed', detail: data })
  } catch (err: any) {
    return res.json({ success: false, error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Dev server running on http://localhost:${PORT}`)
})
