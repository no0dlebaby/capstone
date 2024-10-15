import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-router-dom'],
    },
  },
});
