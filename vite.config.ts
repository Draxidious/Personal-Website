/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Personal-Website/',
  plugins: [react()],
  build: {
    // Three.js + R3F + drei runtime is an unavoidable floor for the 3D
    // scene chunk; it's lazy-loaded separately from the app shell
    // (see src/App.tsx), so it no longer blocks initial paint.
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
