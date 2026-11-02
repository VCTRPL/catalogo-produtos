import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // A API da turma não envia cabeçalhos CORS. Em vez de alterar o back-end,
      // o servidor do Vite repassa as chamadas de /api para a API (proxy).
      // Assim o navegador conversa só com a mesma origem e não bloqueia nada.
      proxy: {
        '/api': {
          target: env.API_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
