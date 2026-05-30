//vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production';
  return {
    plugins: [react(), ...(isDev ? [basicSsl()] : [])],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    base: mode === 'production' ? '/' : '/StudentHub/',
    server: {
      https: isDev ? {} : undefined,
      // Proxy all /auth calls to the login backend so the browser never
      // makes HTTP requests from an HTTPS page (mixed content block).
      proxy: isDev ? {
        '/auth': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          secure: false,
        },
        '/subscription-api': {
          target: 'https://subscription-service-91248372939.us-central1.run.app',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/subscription-api/, ''),
        },
      } : undefined,
    },
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