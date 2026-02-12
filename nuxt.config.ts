// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    notionDocsDataId: process.env.NOTION_DOCS_DATAID,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    public: {
      apiBase: process.env.API_BASE,
      notionDocsDataId: process.env.NOTION_DOCS_DATAID
    }
  },
  css: ['@/assets/css/common.css'],
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image', '@peterbud/nuxt-query', 'nuxt-aos', '@nuxtjs/google-fonts'],
  // @ts-ignore - @peterbud/nuxt-query 모듈 타입 확장
  nuxtQuery: {
    /**
     * 어떤 Vue Query composable을 자동 임포트할지 지정합니다.
     * 기본값: `false`. `true`로 설정하면 모든 Vue Query composable을 자동 임포트합니다.
     */
    autoImports: ['useQuery', 'useMutation'],

    // Nuxt DevTools 연동을 활성화/비활성화합니다 (기본값: true)
    devtools: true,

    /**
     * 이 옵션들은 @tanstack/vue-query의 QueryClient와 동일하며,
     * QueryClient 생성자에 그대로 전달됩니다.
     * 자세한 내용: https://tanstack.com/query/v5/docs/reference/QueryClient
     */
    queryClientOptions: {
      defaultOptions: {
        queries: {
          // 포커스 복귀 시 새로고침 안 함
          refetchOnWindowFocus: false,
          // 5초마다 자동 새로고침 (1000 * 60 * 5, 1000 * 60 * 10 5분마다, 10분마다 설정도 가능)
          refetchInterval: false,
          // 인터넷 재연결 시 새로고침
          refetchOnReconnect: true,
          // 에러를 상태로만 관리 (예외 던지지 않음)
          throwOnError: false,
          // 쿼리 실행 활성화 (개별 쿼리에서 enabled로 오버라이드 가능)
          //enabled: true,
        },
      },
    },
  },
  aos:{
    offset: 100,        // 트리거 지점 오프셋
    duration: 600,      // 애니메이션 지속 시간
    easing: 'ease-out', // 이징
    once: false,         // 한 번만 애니메이션 (스크롤 다운 시)
    delay: 0,          // 지연 시간
  },
  // Google Fonts 설정
  googleFonts: {
    families: {
      'Noto Sans KR': {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      'Azeret Mono': true,
    },
    display: 'swap',    // 폰트 로딩 최적화
    preload: true,      // 폰트 프리로드
    preconnect: true,    // DNS 프리커넥트
  },
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
        // Google Fonts는 @nuxtjs/google-fonts 모듈이 자동으로 처리
      ]
    }
  },

})