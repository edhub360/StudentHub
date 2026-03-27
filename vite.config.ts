//vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    base: mode === 'production' ? '/' : '/StudentHub/',
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          redirectBridge: 'auth-redirect.html',
        },
      },
    },
  };
});