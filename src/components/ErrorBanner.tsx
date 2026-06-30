import { AlertTriangle } from 'lucide-react'

interface Props {
  message: string
  raw?: string
}

export default function ErrorBanner({ message, raw }: Props) {
  const isTimeout = message.includes('408') || message.toLowerCase().includes('timeout') || message.toLowerCase().includes('retry') || message.toLowerCase().includes('warming')

  return (
    <div className="bg-red-900/20 border border-red-800/40 rounded-2xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-300">{message}</p>
          {raw && (
            <pre className="mt-2 text-xs text-red-400/70 bg-red-950/50 rounded-lg p-3 max-h-40 overflow-auto whitespace-pre-wrap font-mono">
              {raw}
            </pre>
          )}
          {isTimeout ? (
            <p className="mt-2 text-xs text-red-400/60">
              The AI model is warming up (cold start, 30-60s). Auto-retrying every 5s until ready.
            </p>
          ) : (
            <p className="mt-2 text-xs text-red-400/60">
              Check your API key and URL are set correctly.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
