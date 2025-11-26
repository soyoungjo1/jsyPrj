// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    notionDocsDataId: process.env.NOTION_DOCS_DATAID,
    public: {
      apiBase: process.env.API_BASE,
      notionDocsDataId: process.env.NOTION_DOCS_DATAID
    }
  },
  css: ['@/assets/css/common.css'],
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image'],
  app: {
    head: {
      title: 'gg',
      meta: [
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover' },
        { name: 'description', content: 'gg'},
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'gg' },
        { property: 'og:description', content: 'gg' },
        { property: 'og:url', content: 'http://yasoyounga.com/' },
        { property: 'og:image', content: 'http://yasoyounga.com/logo.png' },
        { name: 'author', content: 'gg' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap'
        },
      ]
    }
  },

})