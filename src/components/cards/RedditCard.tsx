import { RedditPost, BrandContext } from '../../types'
import { ArrowUp, ArrowDown, MessageCircle, Award, Share2, Bookmark, MoreHorizontal, RefreshCw } from 'lucide-react'
import { getInitials, getAvatarColor } from './utils'

interface Props {
  post: RedditPost
  imageUrl: string
  brand?: BrandContext
  onRegenerate?: () => void
  regenerating?: boolean
}

export default function RedditCard({ post, imageUrl, brand, onRegenerate, regenerating }: Props) {
  const name = brand?.business_name || 'Business'
  const subreddit = 'r/' + (brand?.cuisine?.toLowerCase()?.replace(/[^a-z0-9]/g, '') || 'food')
  const username = 'u/' + name.replace(/[^a-zA-Z0-9]/g, '')
  const initials = getInitials(name)
  const avatarColor = getAvatarColor(name)
  const voteCount = post.title.length % 100 + 2100

  return (
    <div className="bg-[#1a1a1b] border border-gray-700/50 rounded-2xl overflow-hidden">
      <div className="flex">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5 px-2 py-3 w-10 shrink-0 bg-black/20">
          <ArrowUp className="w-6 h-6 text-gray-500 hover:text-orange-500 cursor-pointer transition-colors" />
          <span className="text-xs font-bold text-gray-300">{voteCount}</span>
          <ArrowDown className="w-6 h-6 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-1 py-2 pr-3 min-w-0">
          {/* Subreddit header */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
            <span className="font-semibold text-gray-300">{subreddit}</span>
            <span>·</span>
            <span>Posted by {username}</span>
            <span>·</span>
            <span>2h</span>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={regenerating}
                className="ml-auto p-1 hover:bg-gray-800 rounded-lg transition-colors"
                title="Regenerate this post"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin text-orange-400' : 'text-gray-500 hover:text-orange-400'}`} />
              </button>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-gray-100 leading-tight mb-2">{post.title}</h3>

          {/* Image */}
          <div className="rounded-xl overflow-hidden mb-2 border border-gray-700/30">
            <img src={imageUrl} alt="" className="w-full object-cover max-h-72" />
          </div>

          {/* Body */}
          {post.body && (
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mb-2">{post.body}</p>
          )}

          {/* CTA */}
          {post.cta && (
            <div className="bg-orange-900/20 border border-orange-800/30 rounded-xl px-4 py-2.5 mb-2">
              <span className="text-[11px] text-orange-400 font-semibold uppercase tracking-widest">Call to Action</span>
              <p className="text-sm text-orange-300 mt-0.5">{post.cta}</p>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{post.title.length % 30 + 40} comments</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
              <Award className="w-4 h-4" />
              <span>Award</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
