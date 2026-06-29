import { SocialContentOutput, BrandContext } from '../types'
import TwitterCard from './cards/TwitterCard'
import RedditCard from './cards/RedditCard'
import InstagramCard from './cards/InstagramCard'
import FacebookCard from './cards/FacebookCard'
import ImageTags from './ImageTags'
import { Copy, Check, Download, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface Props {
  data: SocialContentOutput
  imageUrl: string
  brandContext?: BrandContext
  onReset?: () => void
}

export default function ResultsPanel({ data, imageUrl, brandContext, onReset }: Props) {
  const [copied, setCopied] = useState(false)

  const copyAll = () => {
    const json = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJson = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'social-content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-green-500 rounded-full" />
          <h2 className="text-lg font-medium text-gray-200">Generated Content</h2>
          <span className="text-xs text-gray-500 bg-gray-900 px-2.5 py-0.5 rounded-full border border-gray-800">
            4 platforms
          </span>
        </div>
        <div className="flex gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs px-3.5 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-200 transition-all border border-gray-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Image
            </button>
          )}
          <button
            onClick={copyAll}
            className="flex items-center gap-1.5 text-xs px-3.5 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-200 transition-all border border-gray-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button
            onClick={downloadJson}
            className="flex items-center gap-1.5 text-xs px-3.5 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-200 transition-all border border-gray-800"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      <ImageTags tags={data.image_tags} />

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TwitterCard post={data.twitter} imageUrl={imageUrl} brand={brandContext} />
        <RedditCard post={data.reddit} imageUrl={imageUrl} brand={brandContext} />
        <InstagramCard post={data.instagram} imageUrl={imageUrl} brand={brandContext} />
        <FacebookCard post={data.facebook} imageUrl={imageUrl} brand={brandContext} />
      </div>
    </div>
  )
}
