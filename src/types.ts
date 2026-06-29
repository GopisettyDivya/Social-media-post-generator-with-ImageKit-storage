export interface BrandContext {
  business_name: string
  summary?: string
  tone?: string
  website_url?: string
  cuisine?: string
  location_hint?: string
  personality?: string[]
  colors?: string[]
}

export interface TwitterPost {
  text: string
  text_variants: string[]
  hashtags: string[]
  cta: string
  platform_notes: string
}

export interface RedditPost {
  title: string
  title_variants: string[]
  body: string
  body_variants: string[]
  cta: string
  platform_notes: string
}

export interface InstagramPost {
  caption: string
  caption_variants: string[]
  hashtags: string[]
  cta: string
  platform_notes: string
}

export interface FacebookPost {
  caption: string
  caption_variants: string[]
  hashtags: string[]
  cta: string
  platform_notes: string
}

export interface SocialContentOutput {
  twitter: TwitterPost
  reddit: RedditPost
  instagram: InstagramPost
  facebook: FacebookPost
  image_tags: string[]
}

export interface GenerateRequest {
  imageUrl: string
  brandContext: BrandContext
}
