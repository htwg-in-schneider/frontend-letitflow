import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const repoName = '/frontend-letitflow/'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: process.env.NODE_ENV === 'production' ? repoName : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
