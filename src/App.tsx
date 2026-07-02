import { useState, useEffect, useCallback } from 'react'
import { GenerateRequest, SocialContentOutput, BrandContext } from './types'
import { getHistory, getPost, savePost, removePost } from './api'
import type { HistorySummary } from './api'
import InputForm from './components/InputForm'
import ResultsPanel from './components/ResultsPanel'
import ErrorBanner from './components/ErrorBanner'
import HistoryPanel from './components/HistoryPanel'
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import SkeletonCard from './components/SkeletonCard'
import HowItWorksSection from './components/HowItWorksSection'
import PlatformShowcase from './components/PlatformShowcase'
import Footer from './components/Footer'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SocialContentOutput | null>(null)
  const [error, setError] = useState('')
  const [rawError, setRawError] = useState('')
  const [lastImageUrl, setLastImageUrl] = useState('')
  const [lastBrandContext, setLastBrandContext] = useState<BrandContext | undefined>()
  const [history, setHistory] = useState<HistorySummary[]>([])

  const refreshHistory = useCallback(() => {
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    refreshHistory()
    fetch('/api/create_social_post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: '', asset_type: 'post', brand_context: { business_name: '', summary: '' } }),
    }).catch(() => {})
  }, [refreshHistory])

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document.querySelector('#try-it')?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    }
  }, [result])

  async function handleGenerate(data: GenerateRequest, isRetry = false, uploadedImageUrl?: string) {
    const existing = history.find(h => h.image_url === data.imageUrl)
    if (existing) {
      try {
        const post = await getPost(existing.id)
        setResult(JSON.parse(post.result))
        setLastImageUrl(data.imageUrl)
        setLastBrandContext(data.brandContext)
      } catch {
        /* fall through to regenerate */
      }
      return
    }

    setLoading(true)
    setError('')
    setRawError('')
    setResult(null)
    setLastImageUrl(data.imageUrl)
    setLastBrandContext(data.brandContext)

    let currentImageUrl = uploadedImageUrl || data.imageUrl

    const attempt = async (): Promise<void> => {
      const isAlreadyImageKit = currentImageUrl.includes('ik.imagekit.io')
      if (!uploadedImageUrl && !isAlreadyImageKit) {
        try {
          const uploadRes = await fetch('/api/upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: data.imageUrl }),
          })
          const uploadResult = await uploadRes.json()
          if (uploadResult.success) currentImageUrl = uploadResult.imageKitUrl
        } catch { /* non-critical — use original URL */ }
      }

      const res = await fetch('/api/create_social_post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: currentImageUrl,
          asset_type: 'post',
          brand_context: {
            business_name: data.brandContext.business_name,
            summary: data.brandContext.summary || '',
            tone: data.brandContext.tone || '',
            website_url: data.brandContext.website_url || '',
            cuisine: data.brandContext.cuisine || '',
            location_hint: data.brandContext.location_hint || '',
            personality: data.brandContext.personality || [],
            colors: data.brandContext.colors || [],
          },
        }),
      })

      const text = await res.text()

      if (!isRetry && (res.status === 500 || res.status === 504)) {
        setRawError('')
        setError('Generation failed — retrying...')
        await new Promise(r => setTimeout(r, 3000))
        return handleGenerate(data, true, currentImageUrl)
      }

      if (res.status === 503) {
        const body = JSON.parse(text)
        if (body.error === 'still_warming') {
          setError('AI model is warming up — auto-retrying...')
          await new Promise(r => setTimeout(r, 2000))
          return handleGenerate(data, true, currentImageUrl)
        }
      }

      if (!res.ok) {
        setRawError(text.slice(0, 1000))
        throw new Error(`API returned ${res.status}${res.status === 408 ? ' (timeout)' : ''}`)
      }

      const json = JSON.parse(text) as SocialContentOutput
      setResult(json)

      savePost(data.imageUrl, JSON.stringify(data.brandContext), JSON.stringify(json))
      refreshHistory()
    }

    try {
      await attempt()
    } catch (e: any) {
      const msg = e.message || ''
      if (!isRetry && (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('504') || msg.includes('502'))) {
        setError('Connection timed out — retrying...')
        await new Promise(r => setTimeout(r, 2000))
        return handleGenerate(data, true, currentImageUrl)
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleHistorySelect(id: number) {
    try {
      const post = getPost(id)
      setResult(JSON.parse(post.result))
      setLastImageUrl(post.image_url)
      setLastBrandContext(JSON.parse(post.brand_context))
      setError('')
      setRawError('')
    } catch {
      setError('Failed to load the saved post.')
    }
  }

  function handleHistoryDelete(id: number) {
    try {
      removePost(id)
      refreshHistory()
    } catch { /* ignore */ }
  }

  function handleReset() {
    setResult(null)
    setError('')
    setRawError('')
    setTimeout(() => {
      document.querySelector('#try-it')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PlatformShowcase />

      <section id="try-it" className="py-24 px-6 bg-gray-900/20">
        <div className="max-w-6xl mx-auto space-y-10">
          {loading ? (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-yellow-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-medium text-gray-200">Generating...</h2>
                <span className="text-xs text-gray-500 bg-gray-900 px-2.5 py-0.5 rounded-full border border-gray-800 animate-pulse">
                  4 platforms
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SkeletonCard type="twitter" />
                <SkeletonCard type="reddit" />
                <SkeletonCard type="instagram" />
                <SkeletonCard type="facebook" />
              </div>
            </div>
          ) : result ? (
            <>
              <ResultsPanel
                data={result}
                imageUrl={lastImageUrl}
                brandContext={lastBrandContext}
                onReset={handleReset}
              />
              {history.length > 0 && (
                <div id="history" className="pt-6 border-t border-gray-800/50 scroll-mt-20">
                  <HistoryPanel items={history} onSelect={handleHistorySelect} onDelete={handleHistoryDelete} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Get Started</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-2">
                  Ready to Create Your Posts?
                </h2>
                <p className="text-gray-500 mt-3 max-w-lg mx-auto">
                  Paste an image URL, enter your brand details, and let AI do the rest.
                </p>
              </div>

              {error && <ErrorBanner message={error} raw={rawError} />}

              <InputForm onSubmit={handleGenerate} loading={loading} />

              {history.length > 0 && (
                <div id="history" className="pt-6 border-t border-gray-800/50 scroll-mt-20">
                  <HistoryPanel items={history} onSelect={handleHistorySelect} onDelete={handleHistoryDelete} />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
