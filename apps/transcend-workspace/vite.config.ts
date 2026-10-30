import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Builds into /for-transcend/workspace/ in the website (served as static files by Vercel).
export default defineConfig({
  base: '/for-transcend/workspace/',
  plugins: [react()],
  build: {outDir: '../../for-transcend/workspace', emptyOutDir: true, chunkSizeWarningLimit: 1200},
  server: {proxy: {'/api': 'http://localhost:3000'}},
});
