import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, 'data')
const DB_PATH = path.join(DATA_DIR, 'posts.db')

let db: SqlJsDatabase

function save() {
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()))
}

export async function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  const SQL = await initSqlJs()
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH))
  } else {
    db = new SQL.Database()
  }
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    brand_context TEXT NOT NULL,
    result TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`)
  save()
}

export function getAllPosts() {
  const results = db.exec('SELECT id, image_url, brand_context, created_at FROM posts ORDER BY id DESC')
  if (results.length === 0) return []
  const { columns, values } = results[0]
  return values.map(row => {
    const obj: Record<string, unknown> = {}
    columns.forEach((col, i) => { obj[col] = row[i] })
    return obj as { id: number; image_url: string; brand_context: string; created_at: string }
  })
}

export function getPostById(id: number) {
  const results = db.exec('SELECT * FROM posts WHERE id = ?', [id])
  if (results.length === 0 || results[0].values.length === 0) return null
  const { columns, values } = results[0]
  const obj: Record<string, unknown> = {}
  columns.forEach((col, i) => { obj[col] = values[0][i] })
  return obj as { id: number; image_url: string; brand_context: string; result: string; created_at: string }
}

export function createPost(image_url: string, brand_context: string, result: string) {
  db.run('INSERT INTO posts (image_url, brand_context, result) VALUES (?, ?, ?)', [image_url, brand_context, result])
  save()
  const results = db.exec('SELECT last_insert_rowid()')
  const id = Number(results[0].values[0][0])
  return id
}

export function deletePost(id: number) {
  db.run('DELETE FROM posts WHERE id = ?', [id])
  save()
}
