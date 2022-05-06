import { defineConfig } from 'windicss/helpers'

export default defineConfig({
    theme: {
        extend: {
            colors: {
                primary: {
                    500: '#57befc',
                    600: '#2c8af8',
                },
                red: '#f56c6c',
                green: '#67c23a',
            },
            textColor: {
                primary: {
                    darken: '#54759a',
                },
            },
            textShadow: {
                primary: '0 0 6px rgb(44 138 248 / 40%)',
            },
            boxShadow: {
                primary: '2px 5px 20px -3px rgb(44 138 248 / 18%)',
            },
        },
    },
})
