import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { initDb, getAllPosts, getPostById, createPost, deletePost } from './db'
import { uploadImageFromURL, uploadBuffer } from '../services/imagekit.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001
const UPLOADS_DIR = path.join(__dirname, 'uploads')

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files allowed'))
  },
})

const IMAGE_AGENT_URL = process.env.VITE_IMAGE_AGENT_URL || 'https://image-agent-385902914959.us-central1.run.app'
const IMAGE_AGENT_KEY = process.env.VITE_IMAGE_AGENT_API_KEY || ''

app.post('/api/create_social_post', async (req, res) => {
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
})

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const buffer = fs.readFileSync(req.file.path)
  const result = await uploadBuffer(buffer, req.file.originalname)
  fs.unlink(req.file.path, () => {})
  if (!result.success) return res.status(500).json(result)
  res.json({ url: result.imageKitUrl })
})

app.post('/api/upload-to-imagekit', async (req, res) => {
  const { url, folder } = req.body
  if (!url) return res.status(400).json({ error: 'Missing url' })
  const result = await uploadImageFromURL(url, folder)
  res.json(result)
})

app.get('/api/history', (_req, res) => {
  res.json(getAllPosts())
})

app.get('/api/history/:id', (req, res) => {
  const post = getPostById(Number(req.params.id))
  if (!post) return res.status(404).json({ error: 'Not found' })
  res.json(post)
})

app.post('/api/history', (req, res) => {
  const { image_url, brand_context, result } = req.body
  if (!image_url || !brand_context || !result) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const id = createPost(image_url, brand_context, result)
  res.json({ id, created_at: new Date().toISOString() })
})

app.delete('/api/history/:id', (req, res) => {
  deletePost(Number(req.params.id))
  res.json({ ok: true })
})

const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
