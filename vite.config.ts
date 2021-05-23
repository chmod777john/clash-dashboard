import reactRefresh from '@vitejs/plugin-react-refresh'
import tsConfigPath from 'vite-tsconfig-paths'
import windiCSS from 'vite-plugin-windicss'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        reactRefresh(),
        tsConfigPath(),
        windiCSS()
    ],
    base: './',
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "sass:math"; @import "src/styles/variables.scss";'
            }
        }
    }
})
