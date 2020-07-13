module.exports = {
    mode: 'development',
    devtool: "source-map",
    devServer: {
        contentBase: './public',
        port: 8080,
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    module: {
        rules: [{
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [{
                loader: "ts-loader"
            }]
        }, {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        }]
    },
    externals: {
        "pixi.js": "PIXI"
    }
}