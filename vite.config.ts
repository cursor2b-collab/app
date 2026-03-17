import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 苹果 .mobileconfig 需正确 MIME，否则 iOS 不识别为描述文件
    {
      name: 'mobileconfig-mime',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.includes('.mobileconfig')) {
            res.setHeader('Content-Type', 'application/x-apple-aspen-config')
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
