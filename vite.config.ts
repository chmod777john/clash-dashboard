import reactRefresh from '@vitejs/plugin-react-refresh'
import tsConfigPath from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        reactRefresh(),
        tsConfigPath()
    ],
    base: './',
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "src/styles/variables.scss";'
            }
        }
    }
})
