import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Specify your fixed port here
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server during development
        changeOrigin: true,
      },
    },
  },
});
