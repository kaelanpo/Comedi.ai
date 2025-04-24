import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        dashboard: path.resolve(__dirname, 'dashboard.html'),
        account: path.resolve(__dirname, 'account.html'),
        payment: path.resolve(__dirname, 'payment.html'),
        checkout: path.resolve(__dirname, 'checkout.html'),
        signin: path.resolve(__dirname, 'signin.html'),
        signup: path.resolve(__dirname, 'signup.html'),
        privacy: path.resolve(__dirname, 'privacy.html'),
        terms: path.resolve(__dirname, 'terms.html'),
        promptEditor: path.resolve(__dirname, 'prompt-editor.html'),
      },
    },
  },
  server: {
    port: 3001,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
}) 