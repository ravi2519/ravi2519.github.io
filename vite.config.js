import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, existsSync } from 'fs'

function copyCNAMEPlugin() {
  return {
    name: 'copy-cname',
    closeBundle() {
      const src = resolve(__dirname, 'CNAME')
      const dest = resolve(__dirname, 'dist', 'CNAME')
      if (existsSync(src)) {
        copyFileSync(src, dest)
        console.log('CNAME file copied to dist/')
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/ravi2519.github.io/',
  plugins: [react(), copyCNAMEPlugin()],
})
