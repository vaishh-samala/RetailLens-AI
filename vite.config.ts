import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const envDefines: Record<string, string> = {};
  if (fs.existsSync('.env')) {
    const parsed = dotenv.parse(fs.readFileSync('.env'));
    for (const [key, value] of Object.entries(parsed)) {
      process.env[key] = value;
      envDefines[`import.meta.env.${key}`] = JSON.stringify(value);
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    define: envDefines,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
