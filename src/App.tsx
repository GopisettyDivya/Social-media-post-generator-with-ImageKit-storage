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

  const refreshHistory = useCallback(async () => {
    try {
      setHistory(await getHistory())
    } catch { /* server might not be running */ }
  }, [])

  useEffect(() => {
    refreshHistory()
  }, [refreshHistory])

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document.querySelector('#try-it')?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    }
  }, [result])

  async function handleGenerate(data: GenerateRequest, isRetry = false) {
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

    const attempt = async (): Promise<void> => {
      let imageUrl = data.imageUrl
      try {
        const uploadRes = await fetch('/api/upload-to-imagekit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: data.imageUrl }),
        })
        const uploadResult = await uploadRes.json()
        if (uploadResult.success) {
          imageUrl = uploadResult.imageKitUrl
        }
      } catch {
        /* non-critical — use original URL if upload fails */
      }

      const res = await fetch('/api/create_social_post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
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

      if (res.status === 500 && !isRetry) {
        setRawError('')
        setError('Generation failed — retrying...')
        await new Promise(r => setTimeout(r, 3000))
        return handleGenerate(data, true)
      }

      if (!res.ok) {
        setRawError(text.slice(0, 1000))
        throw new Error(`API returned ${res.status}${res.status === 408 ? ' (timeout)' : ''}`)
      }

      const json = JSON.parse(text) as SocialContentOutput
      setResult(json)

      savePost(data.imageUrl, JSON.stringify(data.brandContext), JSON.stringify(json))
        .then(() => refreshHistory())
        .catch(() => {})
    }

    try {
      await attempt()
    } catch (e: any) {
      if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
        setError('Failed to reach the API. Check your internet and .env file.')
      } else {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleHistorySelect(id: number) {
    try {
      const post = await getPost(id)
      setResult(JSON.parse(post.result))
      setLastImageUrl(post.image_url)
      setLastBrandContext(JSON.parse(post.brand_context))
      setError('')
      setRawError('')
    } catch {
      setError('Failed to load the saved post.')
    }
  }

  async function handleHistoryDelete(id: number) {
    try {
      await removePost(id)
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
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-purple-500/30 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-2 border-pink-500/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                </div>
                <p className="text-sm text-gray-500 animate-pulse">Generating posts across 4 platforms...</p>
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
            </>
          )}
        </div>
      </section>

      <section id="history" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <HistoryPanel items={history} onSelect={handleHistorySelect} onDelete={handleHistoryDelete} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
