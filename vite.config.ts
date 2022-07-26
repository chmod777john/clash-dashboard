import react from '@vitejs/plugin-react'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import windiCSS from 'vite-plugin-windicss'
import tsConfigPath from 'vite-tsconfig-paths'

export default defineConfig(
    env => ({
        plugins: [
            // only use react-fresh
            env.mode === 'development' && react({
                babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] },
            }),
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
