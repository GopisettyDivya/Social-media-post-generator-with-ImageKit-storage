import { XTwitterIcon, RedditIcon, InstagramIcon, FacebookIcon } from './icons'

const platforms = [
  {
    icon: XTwitterIcon,
    name: 'Twitter / X',
    gradient: 'from-sky-500 to-blue-600',
    description: 'Concise, engaging tweets with hashtags and a clear call-to-action.',
    format: 'Short-form text + hashtags + CTA',
  },
  {
    icon: RedditIcon,
    name: 'Reddit',
    gradient: 'from-orange-500 to-red-500',
    description: 'Community-focused posts with compelling titles and body text.',
    format: 'Title + body + discussion starter + CTA',
  },
  {
    icon: InstagramIcon,
    name: 'Instagram',
    gradient: 'from-pink-500 to-purple-600',
    description: 'Visual-first captions with hashtags and engagement hooks.',
    format: 'Visual caption + hashtags + CTA',
  },
  {
    icon: FacebookIcon,
    name: 'Facebook',
    gradient: 'from-blue-600 to-blue-800',
    description: 'Shareable updates optimized for community interaction.',
    format: 'Story-driven text + hashtags + CTA',
  },
]

export default function PlatformShowcase() {
  return (
    <section id="platforms" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Platforms</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-2">
            Every Platform, One Workflow
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Each platform gets content tailored to its unique format and audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {platforms.map(p => (
            <div key={p.name} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4 text-white shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200 mb-1">{p.name}</h3>
              <span className="inline-block text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-3">{p.format}</span>
              <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
