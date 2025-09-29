import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({
      filename: 'stats.html', // output file
      open: true,             // auto-open in browser
      gzipSize: true,         // show gzip sizes
      brotliSize: true        // show brotli sizes
    })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          'chakra-vendor': ['@chakra-ui/react', '@chakra-ui/icons', '@emotion/react', '@emotion/styled', 'framer-motion'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'leaflet-vendor': ['leaflet', 'react-leaflet'],
          'dexie-vendor': ['dexie', 'dexie-react-hooks'],
          'heic-vendor': ['heic2any']        
        },
      },
    },
  },
})
