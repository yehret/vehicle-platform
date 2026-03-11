import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '');

  return {
    plugins: [react(), tailwindcss()],

    envDir: '../',

    server: {
      port: 5173,
      proxy: {
        '/api/user': {
          target: env.VITE_API_URL_USER || 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/user/, ''),
        },
      },
    },
  };
});
