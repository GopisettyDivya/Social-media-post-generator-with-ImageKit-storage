import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/50 px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-gray-500">Social Content Generator</span>
        </div>
        <p className="text-xs text-gray-600">Powered by AI &middot; All rights reserved</p>
      </div>
    </footer>
  )
}
