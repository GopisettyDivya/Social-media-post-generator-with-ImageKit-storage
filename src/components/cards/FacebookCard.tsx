import { FacebookPost, BrandContext } from '../../types'
import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal, Heart } from 'lucide-react'
import { getInitials, getAvatarColor } from './utils'

interface Props {
  post: FacebookPost
  imageUrl: string
  brand?: BrandContext
}

export default function FacebookCard({ post, imageUrl, brand }: Props) {
  const name = brand?.business_name || 'Business'
  const initials = getInitials(name)
  const avatarColor = getAvatarColor(name)
  const likes = post.caption.length % 200 + 1050

  return (
    <div className="bg-[#242526] border border-gray-700/40 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-semibold text-gray-100 leading-none">{name}</span>
              <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                <svg viewBox="0 0 16 16" className="w-3 h-3 fill-white"><path d="M13.5 2H9.5a1.5 1.5 0 0 0-1.5 1.5v10a.5.5 0 0 0 .5.5H11a.5.5 0 0 0 .5-.5V9.5h1.5a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5H11.5V5a.5.5 0 0 1 .5-.5h1.5A.5.5 0 0 0 14 4V2.5a.5.5 0 0 0-.5-.5z"/><path d="M4.5 2H2a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V8.5H6.5a.5.5 0 0 1 0-1H8.5V4.5A.5.5 0 0 0 8 4H4.5a.5.5 0 0 1 0-1z"/></svg>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <span>January 15 at 2:30 PM</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-3">
          <p className="text-[15px] text-gray-100 leading-relaxed whitespace-pre-wrap">{post.caption}</p>
          {post.hashtags.length > 0 && (
            <p className="text-sm text-blue-500 mt-1">
              {post.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}
            </p>
          )}
        </div>
      )}

      {/* Image */}
      <div className="bg-gray-800">
        <img src={imageUrl} alt="" className="w-full object-cover max-h-80" />
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-400 border-b border-gray-700/40">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center -mr-1 z-10">
              <ThumbsUp className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>
          <span className="ml-2">{likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{post.caption.length % 20 + 30} comments</span>
          <span>{post.caption.length % 10 + 15} shares</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-around px-4 py-1">
        <div className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors text-gray-400 hover:text-gray-200">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">Like</span>
        </div>
        <div className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors text-gray-400 hover:text-gray-200">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Comment</span>
        </div>
        <div className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors text-gray-400 hover:text-gray-200">
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </div>
      </div>

      {/* CTA */}
      {post.cta && (
        <div className="mx-4 mb-4 bg-blue-900/20 border border-blue-800/30 rounded-xl px-4 py-2.5">
          <span className="text-[11px] text-blue-400 font-semibold uppercase tracking-widest">Call to Action</span>
          <p className="text-sm text-blue-300 mt-0.5">{post.cta}</p>
        </div>
      )}
    </div>
  )
}
