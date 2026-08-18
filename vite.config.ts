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
          target: 'http://localhost:8002',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/subscription-api/, ''),
        },
        '/flashcard-api': {
          target: 'http://localhost:8004',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/flashcard-api/, ''),
        },
        '/quiz-api': {
          target: 'http://localhost:8005',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/quiz-api/, ''),
        },
        '/study-plan-api': {
          target: 'http://localhost:8006',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/study-plan-api/, ''),
        },
        '/ai-chat-api': {
          target: 'http://localhost:8003',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/ai-chat-api/, ''),
        },
        '/notes-api': {
          target: 'http://localhost:8008',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/notes-api/, ''),
        },
        '/cs-bot-api': {
          target: 'http://localhost:8007',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/cs-bot-api/, ''),
        },
        '/courses-api': {
          target: 'http://localhost:8009',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/courses-api/, ''),
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