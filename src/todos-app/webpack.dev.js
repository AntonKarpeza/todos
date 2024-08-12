import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import path from "path";

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    historyApiFallback: true,
    open: true,
    hot: true,
    port: 3000,
  },
});
