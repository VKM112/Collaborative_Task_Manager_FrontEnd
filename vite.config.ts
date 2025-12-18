import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env files based on current mode
  const env = loadEnv(mode, process.cwd(), '')
  const googleClientId = env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
  
  return {
    plugins: [react()],
    define: {
      // Empty in production to avoid bundling secrets
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(googleClientId),
    },
  }
})
