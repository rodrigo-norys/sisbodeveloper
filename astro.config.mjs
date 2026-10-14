// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'

// Os dois idiomas sao simetricos de proposito: `prefixDefaultLocale: true`
// mantem `/pt-br/...` e `/en/...` com a mesma forma, entao publicar a versao
// em ingles de uma pagina e acrescentar um arquivo, nunca reorganizar rota.
export default defineConfig({
  site: 'https://sisbodeveloper.com.br',

  // Com os dois idiomas prefixados, a raiz nao e servida por ninguem: o Astro
  // recusa o build sem esta rota. `redirectToDefaultLocale` resolveria o mesmo
  // caso, e declarar os dois faz as duas fontes disputarem `/`.
  redirects: {
    '/': '/pt-br/',
  },

  i18n: {
    locales: ['pt-br', 'en'],
    defaultLocale: 'pt-br',
    routing: {
      prefixDefaultLocale: true,
    },
  },


  // Arquivos versionados em `src/assets/fonts/`, servidos pelo provider `local`.
  // O provider `fontsource` monta a URL do CDN com `vf@latest` e consulta a API
  // a cada build frio — o build deixa de ser reproduzivel, e a familia pode
  // mudar de bytes sem ninguem tocar no repositorio. Medido no proprio
  // `node_modules/unifont/dist/index.mjs`.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Literata',
      cssVariable: '--font-literata',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/literata-latin-wght-normal.woff2'],
            weight: '200 900',
            style: 'normal',
          },
          {
            src: ['./src/assets/fonts/literata-latin-wght-italic.woff2'],
            weight: '200 900',
            style: 'italic',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Libre Franklin',
      cssVariable: '--font-libre-franklin',
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/libre-franklin-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-ibm-plex-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/ibm-plex-mono-latin-400-normal.woff2'],
            weight: 400,
            style: 'normal',
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
})
