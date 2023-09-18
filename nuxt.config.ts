// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@pinia/nuxt", 
        ['@nuxtjs/google-fonts', {
            families: {
              Roboto: [400, 700],
              'Roboto+Mono': [400, 700],
            }
        }],
    ],
    css: ['~/assets/scss/main.scss'],
    runtimeConfig: {
        PRIVATE_TOKEN: process.env.PRIVATE_TOKEN,
        BASE_URL: process.env.BASE_URL,
        SLEEP_DELAY: process.env.SLEEP_DELAY,
        PAGE_LIMIT: process.env.PAGE_LIMIT,
    },
})
