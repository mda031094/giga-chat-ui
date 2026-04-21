import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.ANALYZE === 'true'
      ? [
          visualizer({
            filename: 'docs/bundle-analysis.html',
            gzipSize: true,
            open: false,
            template: 'treemap',
          }),
        ]
      : []),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
});
