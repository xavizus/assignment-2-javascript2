const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssLoader = {
    loader: 'css-loader',
    options: {
        minimize: true,
    },
}

module.exports = {
    mode: 'production',
    entry: ['./src/js/index.js' ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),

    },
    module: {
        rules: [{
            test: /\.s[ac]ss$/i,
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                },
                'css-loader',
                'sass-loader',

            ],
        }, ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ],
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
      },
};