import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import windiCSS from 'vite-plugin-windicss'
import tsConfigPath from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        reactRefresh(),
        tsConfigPath(),
        windiCSS(),
        VitePWA({
            workbox: {
                sourcemap: false,
            },
        }),
        // https://github.com/vitejs/vite/issues/2144
        {
            name: 'remove-css-in-js',
            enforce: 'post',
            transform (_, id) {
                if (id.endsWith('.scss') || id.endsWith('.css')) {
                    return ''
                }
            },
        },
    ],
    base: './',
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "sass:math"; @import "src/styles/variables.scss";',
            },
        },
    },
    build: {
        minify: 'esbuild',
    },
})
