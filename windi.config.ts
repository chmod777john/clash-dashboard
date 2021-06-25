import { defineConfig } from 'windicss/helpers'

export default defineConfig({
    theme: {
        extend: {
            colors: {
                primary: {
                    500: '#57befc',
                    600: '#2c8af8'
                },
                red: '#f56c6c'
            },
            textShadow: {
                primary: '0 0 6px rgb(44 138 248 / 40%)'
            }
        }
    }
})
