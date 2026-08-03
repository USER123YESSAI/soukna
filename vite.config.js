import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
  },
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});

