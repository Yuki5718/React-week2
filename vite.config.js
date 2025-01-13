import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 產品路徑、開發中路徑
  base: process.env.NODE_ENV === 'production' ? '/React-week2/' : '/',
  plugins: [react()],
})
