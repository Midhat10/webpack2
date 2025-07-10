const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// const { type } = require('os')
// const { name } = require('file-loader')
// const {CleanWebpackPlugin} = require ('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require ('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

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

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const cssLoaders = extra => {
   const loaders = [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // hmr: isDev,
                        // reloadAll: true
                    },
                },'css-loader']

    
    if (extra) {
        loaders.push(extra)
    }
    
    return loaders

}

const babelOptions = preset => {
    const opts = {
        presets: ['@babel/preset-env'
                    ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts

}

const jsLoaders = () => {
    const loaders = [{
                loader: 'babel-loader',
                options: babelOptions()
                }]
    if (isDev) {
        // loaders.push ('eslint-webpack-plugin')
    }
    return loaders
}

const myEslintOptions = {
  extensions: [`js`, `jsx`, `ts`],
  exclude: [`node_modules`],
};

const plugins = () => {
    const base = [
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
            filename: filename('css')
        }),
        // new CleanWebpackPlugin()
        new ESLintPlugin(myEslintOptions)
    ]

    if (isProd) {
        base.push(new BundleAnalyzerPlugin)
    }
    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill','./index.jsx'],
        analytics: './analytics.ts'
    },
    output: {
        filename: filename('js'),
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
    devtool: isDev ? 'source-map' : false,
    
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
             {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use:cssLoaders('sass-loader')
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
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                loader: 'babel-loader',
                options: babelOptions('@babel/preset-typescript')
                }
            }
            ,
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                loader: 'babel-loader',
                options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}