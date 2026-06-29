import { InstagramPost, BrandContext } from '../../types'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react'
import { getInitials, getAvatarColor } from './utils'

interface Props {
  post: InstagramPost
  imageUrl: string
  brand?: BrandContext
}

export default function InstagramCard({ post, imageUrl, brand }: Props) {
  const name = brand?.business_name || 'Business'
  const username = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const initials = getInitials(name)
  const avatarColor = getAvatarColor(name)
  const likes = post.caption.length % 500 + 2100

  return (
    <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-pink-500 ring-offset-1 ring-offset-black"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <span className="text-sm font-semibold text-gray-100">{username}</span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-100" />
      </div>

      {/* Image */}
      <div className="bg-gray-900">
        <img src={imageUrl} alt="" className="w-full aspect-[4/5] object-cover" />
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-gray-100 hover:text-red-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-6 h-6 text-gray-100 hover:text-gray-300 cursor-pointer transition-colors" />
            <Send className="w-6 h-6 text-gray-100 hover:text-gray-300 cursor-pointer transition-colors" />
          </div>
          <Bookmark className="w-6 h-6 text-gray-100 hover:text-gray-300 cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Likes */}
      <div className="px-4 pt-1">
        <span className="text-sm font-semibold text-gray-100">{likes.toLocaleString()} likes</span>
      </div>

      {/* Caption */}
      <div className="px-4 pt-1 pb-2">
        <p className="text-sm text-gray-100">
          <span className="font-semibold">{username}</span>{' '}
          {post.caption}
        </p>
        {post.hashtags.length > 0 && (
          <p className="text-sm text-sky-500 mt-0.5">
            {post.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}
          </p>
        )}
      </div>

      {/* Comments */}
      <div className="px-4 pb-1">
        <p className="text-sm text-gray-500">
          View all {post.caption.length % 20 + 25} comments
        </p>
        <div className="text-sm text-gray-500 mt-0.5">
          <span className="font-semibold text-gray-400">user_{post.caption.length % 100 + 100}</span> This looks amazing! 🤩
        </div>
      </div>

      {/* Timestamp */}
      <div className="px-4 pb-3">
        <span className="text-[10px] text-gray-600 uppercase tracking-wider">2 hours ago</span>
      </div>

      {/* CTA */}
      {post.cta && (
        <div className="mx-4 mb-3 bg-pink-900/20 border border-pink-800/30 rounded-xl px-4 py-2.5">
          <span className="text-[11px] text-pink-400 font-semibold uppercase tracking-widest">Call to Action</span>
          <p className="text-sm text-pink-300 mt-0.5">{post.cta}</p>
        </div>
      )}
    </div>
  )
}
