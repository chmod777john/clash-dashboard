import presetWind from '@unocss/preset-wind'
import { defineConfig } from 'unocss'

export default defineConfig({
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
})
