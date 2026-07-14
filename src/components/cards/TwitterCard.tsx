import { TwitterPost, BrandContext, PlatformName } from '../../types'
import { Heart, Repeat2, MessageCircle, BarChart3, Bookmark, MoreHorizontal, RefreshCw } from 'lucide-react'
import { getInitials, getAvatarColor } from './utils'

interface Props {
  post: TwitterPost
  imageUrl: string
  brand?: BrandContext
  onRegenerate?: () => void
  regenerating?: boolean
}

export default function TwitterCard({ post, imageUrl, brand, onRegenerate, regenerating }: Props) {
  const name = brand?.business_name || 'Business'
  const handle = '@' + name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const initials = getInitials(name)
  const avatarColor = getAvatarColor(name)

  return (
    <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[15px] font-bold text-white leading-none">{name}</span>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-label="Verified"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z" /></svg>
                <span className="text-[15px] text-gray-500 leading-none ml-0.5">{handle}</span>
                <span className="text-[15px] text-gray-500 leading-none mx-0.5">·</span>
                <span className="text-[15px] text-gray-500 leading-none">1h</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={regenerating}
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                title="Regenerate this post"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 hover:text-sky-400 ${regenerating ? 'animate-spin text-sky-400' : ''}`} />
              </button>
            )}
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Tweet text */}
        <p className="text-[15px] text-gray-100 leading-normal whitespace-pre-wrap">{post.text}</p>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden border border-gray-800">
          <img src={imageUrl} alt="" className="w-full object-cover max-h-80" />
        </div>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <p className="text-sm text-sky-500">
            {post.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}
          </p>
        )}

        {/* Engagement bar */}
        <div className="flex items-center justify-between pt-1 max-w-md">
          <div className="flex items-center gap-1 group cursor-pointer">
            <MessageCircle className="w-[18px] h-[18px] text-gray-500 group-hover:text-sky-500 transition-colors" />
            <span className="text-xs text-gray-500 group-hover:text-sky-500 transition-colors">
              {post.text.length % 20 + 8}
            </span>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer">
            <Repeat2 className="w-[18px] h-[18px] text-gray-500 group-hover:text-green-500 transition-colors" />
            <span className="text-xs text-gray-500 group-hover:text-green-500 transition-colors">
              {post.text.length % 30 + 15}
            </span>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer">
            <Heart className="w-[18px] h-[18px] text-gray-500 group-hover:text-pink-500 transition-colors" />
            <span className="text-xs text-gray-500 group-hover:text-pink-500 transition-colors">
              {post.text.length % 50 + 100}
            </span>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer">
            <Bookmark className="w-[18px] h-[18px] text-gray-500 group-hover:text-sky-500 transition-colors" />
            <span className="text-xs text-gray-500 group-hover:text-sky-500 transition-colors">
              {post.text.length % 15 + 5}
            </span>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer">
            <BarChart3 className="w-[18px] h-[18px] text-gray-500 group-hover:text-sky-500 transition-colors" />
            <span className="text-xs text-gray-500 group-hover:text-sky-500 transition-colors">
              {post.text.length % 10 + 1}.{post.text.length % 9 + 1}K
            </span>
          </div>
        </div>

        {/* CTA */}
        {post.cta && (
          <div className="bg-sky-900/20 border border-sky-800/30 rounded-xl px-4 py-3">
            <span className="text-[11px] text-sky-400 font-semibold uppercase tracking-widest">Call to Action</span>
            <p className="text-sm text-sky-300 mt-0.5">{post.cta}</p>
          </div>
        )}
      </div>
    </div>
  )
}
