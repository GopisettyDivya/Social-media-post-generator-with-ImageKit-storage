import { Tags } from 'lucide-react'

interface Props {
  tags: string[]
}

export default function ImageTags({ tags }: Props) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-2 text-gray-400 mb-2.5">
        <Tags className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Image Tags</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-xl text-sm bg-purple-900/30 text-purple-300 border border-purple-800/40"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
