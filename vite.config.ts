import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run build:artifact` bygger en version som läggs i en enda HTML-fil för Claude-artefakten
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: { host: true },
  build: mode === 'artifact'
    ? { outDir: 'dist-artifact', assetsInlineLimit: 10_000_000, cssCodeSplit: false, modulePreload: false, rollupOptions: { output: { inlineDynamicImports: true } } }
    : {},
}));
