const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// const { type } = require('os')
// const { name } = require('file-loader')
// const {CleanWebpackPlugin} = require ('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require ('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
 splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    }
    return config
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js',
        analytics: './analytics.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean:true
    },
    resolve: {
        extensions: ['.js','.json','.png'],
        alias: {
            '@models': path.resolve(__dirname,'src/models'),
            '@': path.resolve(__dirname,'src'),
        }
    },
    optimization: optimization()
    ,
    devServer: {
        open: true,
        // hot: isDev,
        port: 'auto',
        static: {
            directory: './src',
            watch: true
      }
    }
    ,
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        })
        ,
        new CopyWebpackPlugin({
            patterns: [
            {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }
        ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
        // new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // hmr: isDev,
                        // reloadAll: true
                    },
                },'css-loader']
            },
             {
                test: /\.less$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                    },
                },
                'css-loader',
                'less-loader']
            },
            {
                test: /\.(png|jpg|svg|gif|ttf|woff|woff2|eot)$/,
                type: "asset/resource"
            },
            {
                test: /\.(xml)/,
                use: ['xml-loader']
            },
            {
                test: /\.(csv)/,
                use: ['csv-loader']
            }
        ]
    }
}