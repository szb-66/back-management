import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
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
    proxy: {
      '/szb-api': {
        target: 'http://szb.design:3000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/szb-api/, ''),
      },
    },
  }
})


