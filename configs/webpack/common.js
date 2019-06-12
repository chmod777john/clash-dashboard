// shared config (dev and prod)
const { resolve } = require('path')
const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const OfflinePlugin = require('offline-plugin')
const autoprefixer = require('autoprefixer')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
        plugins: [new TsConfigPathsPlugin()],
        alias: {
            '@styles': resolve(__dirname, 'src/styles/'),
        },
    },
    context: resolve(__dirname, '../../src'),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                use: ['tslint-loader']
            },
            {
                test: /\.js$/,
                use: ['babel-loader', 'source-map-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'awesome-typescript-loader'],
            },
            {
                test: /\.scss$/,
                loaders: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { plugins: [autoprefixer] } },
                    { loader: 'sass-loader', options: { implementation: require('sass') } }
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
                ],
            },
        ],
    },
    plugins: [
        new CheckerPlugin(),
        new StyleLintPlugin(),
        new HtmlWebpackPlugin({ template: 'index.html.ejs' }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        })
        // new OfflinePlugin({
        //     ServiceWorker: {
        //         events: true,
        //     },
        //     externals: [
        //         'https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/umd/react.production.min.js',
        //         'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.2/umd/react-dom.production.min.js',
        //     ],
        // }),
    ],
    // externals: {
    //     react: 'React',
    //     'react-dom': 'ReactDOM',
    // },
    performance: {
        hints: false,
    },
}
