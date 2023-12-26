//webpack.config.js
const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    product: "./src/handlers/product.ts",
    basket: "./src/handlers/basket.ts",
    order: "./src/handlers/order.ts",
  },
  target: "node",
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};
