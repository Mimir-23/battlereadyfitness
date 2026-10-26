import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import astro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y-x'
import tsParser from '@typescript-eslint/parser'
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
  // Accesibilidad del panel /admin (React).
  {
    files: ['src/admin/**/*.jsx'],
    extends: [jsxA11y.configs.recommended],
  },
  // Componentes y páginas .astro: sintaxis de Astro + las mismas reglas de
  // accesibilidad (alt, nombres de botones, roles ARIA válidos…).
  ...astro.configs['flat/recommended'],
  ...astro.configs['flat/jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      // El frontmatter de algunos componentes declara `interface Props`.
      parserOptions: { parser: tsParser },
    },
    rules: {
      // Los textos de las opciones del panel de accesibilidad van un nivel
      // más adentro (texto visible + versión para lector de pantalla).
      'astro/jsx-a11y/label-has-associated-control': ['error', { depth: 3 }],
    },
  },
  {
    // Código que corre en el servidor (render, endpoints /api) y scripts de
    // Node. Parte de src/lib se comparte con el navegador.
    files: ['src/lib/**/*.js', 'src/pages/**/*.js', 'scripts/**/*.mjs', 'astro.config.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
])
