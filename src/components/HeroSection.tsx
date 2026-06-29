import { ArrowDown } from 'lucide-react'
import { XTwitterIcon, RedditIcon, InstagramIcon, FacebookIcon } from './icons'

const platforms = [
  { icon: XTwitterIcon, label: 'Twitter / X', gradient: 'from-sky-500 to-blue-600' },
  { icon: RedditIcon, label: 'Reddit', gradient: 'from-orange-500 to-red-500' },
  { icon: InstagramIcon, label: 'Instagram', gradient: 'from-pink-500 to-purple-600' },
  { icon: FacebookIcon, label: 'Facebook', gradient: 'from-blue-600 to-blue-800' },
]

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-gray-950 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        {platforms.map((p, i) => (
          <div
            key={p.label}
            className={`absolute animate-${i % 2 === 0 ? 'float' : 'float-delayed'}`}
            style={{ top: `${15 + i * 18}%`, left: `${5 + i * 25}%` }}
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-2xl opacity-30`}>
              <p.icon className="w-7 h-7 text-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-800/30 text-purple-300 text-xs font-medium mb-8 animate-fade-in-down">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          AI-Powered Content Generation
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            AI-Powered
          </span>
          <br />
          <span className="text-gray-100">Social Media Content</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Generate platform-optimized posts for Twitter, Reddit, Instagram, and Facebook
          from a single image. Powered by AI. Ready in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => scrollTo('#try-it')}
            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold text-base transition-all shadow-xl shadow-purple-900/30 hover:shadow-purple-900/50"
          >
            Get Started Free
          </button>
          <button
            onClick={() => scrollTo('#features')}
            className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold text-base transition-all border border-gray-700/50"
          >
            See How It Works
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {platforms.map(p => (
            <div key={p.label} className="flex items-center gap-2 text-gray-500">
              <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white`}>
                <p.icon className="w-4 h-4" />
              </span>
              <span className="text-xs hidden sm:inline">{p.label}</span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </section>
  )
}
