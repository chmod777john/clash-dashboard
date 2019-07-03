// development config
const merge = require('webpack-merge')
const webpack = require('webpack')
// const { resolve } = require('path')
// const ManifestPlugin = require('webpack-pwa-manifest')
const commonConfig = require('./common')

module.exports = merge(commonConfig, {
    mode: 'development',
    entry: [
        'react-hot-loader/patch', // activate HMR for React
        'webpack-dev-server/client?http://localhost:8080', // bundle the client for webpack-dev-server and connect to the provided endpoint
        'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
        './index.ts', // the entry point of our app
    ],
    devServer: {
        hot: true, // enable HMR on the server
        noInfo: true,
    },
    resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom'
        }
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
        // new ManifestPlugin({
        //     name: 'Clash Development',
        //     background_color: '#FFFFFF',
        //     crossorigin: 'anonymous',
        //     inject: true,
        //     fingerprints: false,
        //     icons: [
        //         {
        //             src: resolve('src/assets/Icon.png'),
        //             sizes: [96, 128, 192, 256],
        //             destination: 'img/icons',
        //         },
        //     ],
        // }),
    ],
})
