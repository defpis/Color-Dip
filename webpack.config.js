const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const fromRoot = (...paths) => path.resolve(__dirname, ...paths);

module.exports = {
  devtool: "source-map",
  mode: "development",
  context: fromRoot(),
  entry: fromRoot("src/index.ts"),
  output: {
    path: fromRoot("dist"),
    filename: "js/[name].[contenthash:8].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@": fromRoot("src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(glsl|vert|frag)$/,
        loader: "shader-loader",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: fromRoot("public/index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: fromRoot("public"),
          from: "**/*",
          to: fromRoot("dist"),
          toType: "dir",
          filter: (resourcePath) =>
            ![/public\/index.html/].some((exclude) =>
              exclude.test(resourcePath)
            ),
          noErrorOnMissing: true,
        },
        {
          context: fromRoot("src/assets"),
          from: "**/*",
          to: fromRoot("dist/assets"),
          toType: "dir",
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  devServer: {
    historyApiFallback: true,
    host: "localhost",
    port: 8080,
    hot: true,
    open: true,
  },
};
