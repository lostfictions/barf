const path = require("path");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "cms.js"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "../../dist/admin/")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
