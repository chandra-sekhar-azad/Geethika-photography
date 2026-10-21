import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Try to resolve packages using "main" field instead of "exports"
    // This helps with compatibility issues on newer Node.js versions
    extensions: ['.js', '.jsx', '.mjs', '.json'],
  },
  // Disable minification to see if that's the issue
  minify: false,
})
