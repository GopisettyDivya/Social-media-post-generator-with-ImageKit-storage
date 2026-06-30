import { useState, useRef } from 'react'
import { GenerateRequest, BrandContext } from '../types'
import { Send, Image, Plus, X, Upload } from 'lucide-react'

interface Props {
  onSubmit: (data: GenerateRequest) => void
  loading: boolean
}

export default function InputForm({ onSubmit, loading }: Props) {
  const [imageUrl, setImageUrl] = useState('')
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [brand, setBrand] = useState<BrandContext>({ business_name: '' })
  const [personalityInput, setPersonalityInput] = useState('')
  const [colorInput, setColorInput] = useState('#')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImageUrl(val: string) {
    setImageUrl(val)
    if (val.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
      setPreview(val)
    } else {
      setPreview('')
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
      const res = await fetch('/api/upload-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, fileName: file.name }),
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      if (!data.url) throw new Error(data.message || 'Upload failed')
      setImageUrl(data.url)
      setPreview(data.url)
    } catch {
      alert('Failed to upload image. Make sure the backend is running.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function updateBrand<K extends keyof BrandContext>(key: K, value: BrandContext[K]) {
    setBrand(p => ({ ...p, [key]: value }))
  }

  function addPersonality() {
    const val = personalityInput.trim()
    if (val && !(brand.personality || []).includes(val)) {
      updateBrand('personality', [...(brand.personality || []), val])
    }
    setPersonalityInput('')
  }

  function removePersonality(idx: number) {
    const arr = brand.personality?.filter((_, i) => i !== idx) || []
    updateBrand('personality', arr.length > 0 ? arr : undefined)
  }

  function addColor() {
    const val = colorInput.trim()
    if (val.match(/^#[0-9A-Fa-f]{6}$/) && !(brand.colors || []).includes(val)) {
      updateBrand('colors', [...(brand.colors || []), val])
    }
    setColorInput('#')
  }

  function removeColor(idx: number) {
    const arr = brand.colors?.filter((_, i) => i !== idx) || []
    updateBrand('colors', arr.length > 0 ? arr : undefined)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!imageUrl || !brand.business_name) return
    onSubmit({ imageUrl, brandContext: brand })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 text-gray-300">
          <Image className="w-4 h-4 text-purple-400" />
          <h2 className="font-medium">Image & Brand</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Image</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => handleImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload from computer"
                  className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  required
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 rounded-xl text-gray-400 hover:text-gray-200 transition-all border border-gray-700/50 shrink-0"
                  title="Upload from computer"
                >
                  <Upload className={`w-4 h-4 ${uploading ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Business Name</label>
                <input
                  type="text"
                  value={brand.business_name}
                  onChange={e => updateBrand('business_name', e.target.value)}
                  placeholder="Dates and Olives"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Tone</label>
                <input
                  type="text"
                  value={brand.tone || ''}
                  onChange={e => updateBrand('tone', e.target.value)}
                  placeholder="warm, casual, local"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Summary</label>
              <textarea
                value={brand.summary || ''}
                onChange={e => updateBrand('summary', e.target.value)}
                placeholder="Dates and Olives is a family-owned business that sells mediterranean food."
                rows={2}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Website</label>
                <input
                  type="url"
                  value={brand.website_url || ''}
                  onChange={e => updateBrand('website_url', e.target.value)}
                  placeholder="https://datesandolives.com"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Cuisine</label>
                <input
                  type="text"
                  value={brand.cuisine || ''}
                  onChange={e => updateBrand('cuisine', e.target.value)}
                  placeholder="Middle Eastern"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={brand.location_hint || ''}
                  onChange={e => updateBrand('location_hint', e.target.value)}
                  placeholder="Nattick, MA"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Personality tags */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Personality</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={personalityInput}
                  onChange={e => setPersonalityInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPersonality(); } }}
                  placeholder="friendly, authentic..."
                  className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
                <button type="button" onClick={addPersonality} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {brand.personality && brand.personality.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {brand.personality.map((p, i) => (
                    <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-900/30 text-purple-300 border border-purple-800/40 text-xs">
                      {p}
                      <button type="button" onClick={() => removePersonality(i)} className="hover:text-purple-100"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Brand colors */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Brand Colors</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={e => setColorInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }}
                  placeholder="#C0392B"
                  className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono"
                />
                <button type="button" onClick={addColor} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {brand.colors && brand.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {brand.colors.map((c, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 text-xs">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c }} />
                      {c}
                      <button type="button" onClick={() => removeColor(i)} className="hover:text-gray-100"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {preview ? (
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview('')} />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600">
                <div className="text-center">
                  <Image className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">Image preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !imageUrl || !brand.business_name}
        className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-900/20 disabled:shadow-none"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Generating...' : 'Generate Posts'}
      </button>
    </form>
  )
}
