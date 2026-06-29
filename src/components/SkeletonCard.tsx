const skeletons = {
  twitter: (
    <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden p-4 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-gray-800" />
            <div className="h-3 w-20 rounded bg-gray-800" />
          </div>
        </div>
        <div className="w-5 h-5 rounded bg-gray-800" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-800" />
        <div className="h-3 w-3/4 rounded bg-gray-800" />
        <div className="h-3 w-5/6 rounded bg-gray-800" />
      </div>
      <div className="h-48 w-full rounded-2xl bg-gray-800" />
      <div className="flex gap-4">
        {[1,2,3,4,5].map(i => <div key={i} className="h-4 w-10 rounded bg-gray-800" />)}
      </div>
    </div>
  ),

  reddit: (
    <div className="bg-[#1a1a1b] border border-gray-700/50 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex">
        <div className="flex flex-col items-center gap-1.5 px-2 py-3 w-10 shrink-0">
          <div className="w-5 h-5 rounded bg-gray-800" />
          <div className="h-4 w-6 rounded bg-gray-800" />
          <div className="w-5 h-5 rounded bg-gray-800" />
        </div>
        <div className="flex-1 py-2 pr-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-800" />
            <div className="h-3 w-24 rounded bg-gray-800" />
            <div className="h-3 w-16 rounded bg-gray-800" />
          </div>
          <div className="h-5 w-4/5 rounded bg-gray-800" />
          <div className="h-5 w-3/5 rounded bg-gray-800" />
          <div className="h-44 w-full rounded-xl bg-gray-800" />
          <div className="flex gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-4 w-16 rounded bg-gray-800" />)}
          </div>
        </div>
      </div>
    </div>
  ),

  instagram: (
    <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-gray-800" />
        <div className="h-4 w-28 rounded bg-gray-800" />
      </div>
      <div className="aspect-[4/5] bg-gray-800" />
      <div className="px-4 pt-3 pb-1 space-y-2">
        <div className="flex gap-4">
          {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded bg-gray-800" />)}
        </div>
        <div className="h-4 w-24 rounded bg-gray-800" />
        <div className="space-y-1">
          <div className="h-3 w-full rounded bg-gray-800" />
          <div className="h-3 w-3/4 rounded bg-gray-800" />
        </div>
        <div className="h-3 w-32 rounded bg-gray-800" />
      </div>
    </div>
  ),

  facebook: (
    <div className="bg-[#242526] border border-gray-700/50 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-gray-700" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-28 rounded bg-gray-700" />
          <div className="h-3 w-20 rounded bg-gray-700" />
        </div>
      </div>
      <div className="h-48 w-full bg-gray-700" />
      <div className="px-4 py-3 space-y-2">
        <div className="h-3 w-full rounded bg-gray-700" />
        <div className="h-3 w-4/5 rounded bg-gray-700" />
        <div className="h-3 w-3/5 rounded bg-gray-700" />
      </div>
      <div className="border-t border-gray-700/50 px-4 py-2">
        <div className="flex justify-around">
          {[1,2,3].map(i => <div key={i} className="h-4 w-20 rounded bg-gray-700" />)}
        </div>
      </div>
    </div>
  ),
}

export default function SkeletonCard({ type }: { type: keyof typeof skeletons }) {
  return skeletons[type]
}
