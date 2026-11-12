import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { routes } from './src/routing/routes';

function staticRoutePages(): Plugin {
  return {
    name: 'portfolio-static-routes',
    apply: 'build',
    async writeBundle({ dir }) {
      if (!dir) return;
      const index = join(dir, 'index.html');
      await Promise.all([
        copyFile(index, join(dir, '404.html')),
        ...routes.filter(route => route !== '/').map(async route => {
          const routeDir = join(dir, route);
          await mkdir(routeDir, { recursive: true });
          await copyFile(index, join(routeDir, 'index.html'));
        }),
      ]);
    },
  };
}

export default defineConfig({
  plugins: [react(), staticRoutePages()],
  server: {
    port: 3000,
    host: true
  }
});
