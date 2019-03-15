const webpack = require('webpack');
const path = require('path');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env, argv) => {
    const mode = argv.mode; // development, production
    const prod = mode === 'production';

    return {
        mode,
        entry: {
            // bootstrap 은 jquery 와 popper 에 의존
            vendors: [
                'jquery',
                // 'popper.js',
                './src/lib/TweenMax.min.js'
            ],
            main: ['./src/scripts/main.js'],
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js'
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader', // translates CSS into CommonJS modules
                        options: {
                            minimize: true
                        }
                    }, {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            plugins() {
                                // post css plugins, can be exported to postcss.config.js
                                return [
                                    precss,
                                    autoprefixer
                                ];
                            },
                        }
                    }, {
                        loader: 'sass-loader' // compiles SASS to CSS
                    }]
                })
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images/'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // production 에서만 품질 조절
                        },
                    },
                ]
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/fonts/'
                    }
                }
            },
            ]
        },
        plugins: [
            // 의존성 처리
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new ExtractTextPlugin('main.css'),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                minify: !prod ? false : {
                    removeComments: true,
                    collapseWhitespace: true
                }
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 3000,
            watchContentBase: true,
        },
    }
};