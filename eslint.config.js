import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.vercel', '.astro']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Código que corre en el servidor (render, endpoints /api) y scripts de
    // Node. Parte de src/lib se comparte con el navegador.
    files: ['src/lib/**/*.js', 'src/pages/**/*.js', 'scripts/**/*.mjs', 'astro.config.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
])
