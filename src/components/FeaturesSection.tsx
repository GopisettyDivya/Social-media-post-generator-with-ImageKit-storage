import { Target, Zap, Brain, Palette } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Platform-Optimized',
    description: 'Each post is tailored to the specific platform\'s format, tone, and audience expectations.',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Get all four platform posts in seconds — no manual rewriting or copy-pasting needed.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Brain,
    title: 'Image-Aware AI',
    description: 'The AI analyzes your image to generate contextual, relevant content that matches the visual.',
    gradient: 'from-pink-500 to-purple-600',
  },
  {
    icon: Palette,
    title: 'Brand Voice Control',
    description: 'Customize tone, personality, and brand colors to keep your content on-brand everywhere.',
    gradient: 'from-blue-600 to-blue-800',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-2">
            Why Social Content Generator?
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Everything you need to create engaging social media content from a single image.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
