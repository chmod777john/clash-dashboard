import presetWind from '@unocss/preset-wind'
import react from '@vitejs/plugin-react'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import UnoCSS from 'unocss/vite'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsConfigPath from 'vite-tsconfig-paths'

export default defineConfig(
    env => ({
        plugins: [
            // only use react-fresh
            env.mode === 'development' && react({
                babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] },
            }),
            tsConfigPath(),
            UnoCSS({
                presets: [presetWind()],
                theme: {
                    colors: {
                        primary: {
                            500: '#57befc',
                            600: '#2c8af8',
                            darken: '#54759a',
                        },
                        red: '#f56c6c',
                        green: '#67c23a',
                    },
                    boxShadow: {
                        primary: '2px 5px 20px -3px rgb(44 138 248 / 18%)',
                    },
                    textShadow: {
                        primary: '0 0 6px rgb(44 138 248 / 40%)',
                    },
                },
            }),
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
            splitVendorChunkPlugin(),
        ],
        server: {
            port: 3000,
        },
        base: './',
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "sass:math"; @import "src/styles/variables.scss";',
                },
            },
        },
        build: { reportCompressedSize: false },
        esbuild: {
            jsxInject: "import React from 'react'",
        },
    }),
)
