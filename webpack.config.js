const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './demo/js/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[hash].[name].bundle.js',
        chunkFilename: '[hash].[id].bundle.js',
        publicPath: '/'
    },
    devtool: '#source-map',
    devServer: {
        historyApiFallback: false,
        stats: 'minimal',
        port: 8080,
        host: '0.0.0.0'
    },
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.ts$/,
                use: ['ts-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png)\w*/,
                use: ['file-loader']
            },
            {
                test: /(\.tpl|\.style)$/,
                use: ['raw-loader']
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname),
            path.resolve(__dirname, 'node_modules')
        ],
        extensions: [
            '.js',
            '.ts'
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.bundle.js'),
        new HtmlWebpackPlugin({
            title: 'angular2-baidu-map',
            filename: 'index.html',
            inject: 'body',
            template: 'demo/index.ejs',
            hash: false,
            favicon: 'demo/img/favicon.ico'
        })
    ]
};
