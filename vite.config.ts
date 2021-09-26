import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import windiCSS from 'vite-plugin-windicss'
import tsConfigPath from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        react({ babel: { compact: false } }),
        tsConfigPath(),
        windiCSS(),
        VitePWA({
            injectRegister: 'inline',
            manifest: {
                icons: [{
                    src: '//cdn.jsdelivr.net/gh/Dreamacro/clash-dashboard/src/assets/Icon.png',
                    sizes: '512x512',
                    type: 'image/png',
                }],
                start_url: '/',
                short_name: 'Clash Dashboard',
                name: 'Clash Dashboard',
            },
        }),
    ],
    base: './',
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "sass:math"; @import "src/styles/variables.scss";',
            },
        },
    },
    build: { reportCompressedSize: false },
})
