const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const baseConfig = {
    experiments: {
        topLevelAwait: true,
    },
    entry: path.resolve(__dirname, './src/index.ts'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|jp2|webp)$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.svg', 'png', 'jpg', 'jpeg'],
    },
    output: {
        assetModuleFilename: 'assets/[hash][ext]',
        filename: 'index.js',
        path: path.resolve(__dirname, 'bundle'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({ patterns: [{ from: 'src/assets', to: 'assets' }] }),
        new webpack.ProvidePlugin({
            noUiSlider: 'nouislider',
        }),
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};
