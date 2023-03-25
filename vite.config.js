import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repositoryName = "nicechord-vue"

export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? '/' + repositoryName + '/'
    : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
