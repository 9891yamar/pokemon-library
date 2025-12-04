// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    typescript: {
        typeCheck: true, // 開発サーバー起動時に型チェックを行う
        strict: true, // 厳格モード
    },
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
    },
});
