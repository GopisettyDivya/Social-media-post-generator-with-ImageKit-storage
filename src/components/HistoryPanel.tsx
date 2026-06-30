import { Clock, ExternalLink, Trash2 } from 'lucide-react'
import type { HistorySummary } from '../api'

interface Props {
  items: HistorySummary[]
  onSelect: (id: number) => void
  onDelete: (id: number) => void
}

function getBusinessName(raw: string): string {
  try {
    return JSON.parse(raw).business_name || 'Untitled'
  } catch {
    return 'Untitled'
  }
}

export default function HistoryPanel({ items, onSelect, onDelete }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-400">
        <Clock className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Past Posts</span>
        <span className="text-[11px] text-gray-600 bg-gray-900 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-600 bg-gray-900/30 border border-gray-800/50 rounded-xl px-5 py-6 text-center">
          No past posts yet. Generate your first post above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-gray-900/40 border border-gray-800 rounded-xl p-3 flex gap-3 hover:border-gray-700 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                <img src={item.image_url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {getBusinessName(item.brand_context)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.created_at + 'Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                <button
                  onClick={() => onSelect(item.id)}
                  className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
                  title="View post"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
