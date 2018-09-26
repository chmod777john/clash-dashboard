// production config
const merge = require('webpack-merge')
const { resolve } = require('path')
const ManifestPlugin = require('webpack-pwa-manifest')

const commonConfig = require('./common')

module.exports = merge(commonConfig, {
    mode: 'production',
    entry: './index.ts',
    output: {
        filename: 'js/bundle.[hash].min.js',
        path: resolve(__dirname, '../../dist'),
        publicPath: '/',
    },
    devtool: 'source-map',
    plugins: [
        new ManifestPlugin({
            name: 'Clash',
            background_color: '#FFFFFF',
            crossorigin: 'anonymous',
            inject: true,
            fingerprints: false,
            icons: [
                {
                    src: resolve('src/assets/Icon.png'),
                    sizes: [96, 128, 192, 256],
                    destination: 'img/icons',
                },
            ],
        }),
    ],
})
