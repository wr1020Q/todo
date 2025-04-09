import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: 3000,  // 開発サーバーのポート番号
        host: '0.0.0.0',  // 外部からもアクセスできるようにする（任意）
      }
})