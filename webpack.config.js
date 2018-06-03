const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const bundleOutputDir = "./wwwroot/dist";
const isDevBuild = () => {
    !(env && env.prod);
};
module.exports = {
    mode: isDevBuild ? "development" : "production",

    stats: { modules: false },
    entry: { main: "./ClientApp/boot-app.js" },
    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            vue$: "vue/dist/vue",
            components: path.resolve(__dirname, "./ClientApp/components"),
            views: path.resolve(__dirname, "./ClientApp/views"),
            utils: path.resolve(__dirname, "./ClientApp/utils"),
            api: path.resolve(__dirname, "./ClientApp/store/api")
        }
    },
    output: {
        path: path.join(__dirname, bundleOutputDir),
        filename: "[name].js",
        publicPath: "/dist/"
    },
    module: {
        rules: [
            { test: /\.vue$/, include: /ClientApp/, use: "vue-loader" },
            {
                test: /\.js$/,
                include: /ClientApp/,
                use: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    isDevBuild ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: "url-loader?limit=25000"
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("./wwwroot/dist/vendor-manifest.json")
        })
    ].concat(
        isDevBuild
            ? [
                  // Plugins that apply in development builds only
                  new webpack.SourceMapDevToolPlugin({
                      filename: "[file].map", // Remove this line if you prefer inline source maps
                      moduleFilenameTemplate: path.relative(
                          bundleOutputDir,
                          "[resourcePath]"
                      ) // Point sourcemap entries to the original file locations on disk
                  })
              ]
            : [
                  // Plugins that apply in production builds only
                  new webpack.optimize.UglifyJsPlugin(),
                  new MiniCssExtractPlugin({
                      filename: "[name].css",
                      chunkFilename: "[id].css"
                  })
              ]
    )
};
