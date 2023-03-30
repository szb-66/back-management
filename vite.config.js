import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd());
  const regExp = eval("/^" + (env.VITE_APP_BASE_URL ? `\\${env.VITE_APP_BASE_URL}` : "") + "/");
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      // 自动
      open: true,
      port: env.VITE_APP_BASE_PORT || 9000,
      proxy: {
        [env.VITE_APP_BASE_URL]: {
          target: env.VITE_APP_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(regExp, ''),
        },
      },
    },
  }
})
