import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/imagekit-auth': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/api/upload-to-imagekit': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/api/create_social_post': {
          target: env.VITE_IMAGE_AGENT_URL || 'https://image-agent-385902914959.us-central1.run.app',
          changeOrigin: true,
          timeout: 180000,
          proxyTimeout: 180000,
          rewrite: (path) => path.replace(/^\/api\/create_social_post/, '/create_social_post'),
          headers: {
            'X-API-Key': env.VITE_IMAGE_AGENT_API_KEY || '',
          },
        },
      },
    },
  }
})
