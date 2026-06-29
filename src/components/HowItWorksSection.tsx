import { Link, FileText, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Link,
    number: '01',
    title: 'Provide Image URL',
    description: 'Paste the URL of the image you want to generate social media content around.',
  },
  {
    icon: FileText,
    number: '02',
    title: 'Enter Brand Context',
    description: 'Tell us about your business — name, tone, cuisine, location, and brand colors.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Generate & Post',
    description: 'Get optimized posts for Twitter, Reddit, Instagram, and Facebook instantly.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-900/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-2">
            Three Simple Steps
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            From image to four platform-ready posts in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0" />

          {steps.map(step => (
            <div key={step.number} className="flex flex-col items-center text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-xl shadow-purple-900/30 relative z-10">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-purple-400 mb-2">{step.number}</span>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
