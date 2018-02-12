module.exports = {
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          {
            loader: 'css-loader',
            options: { modules: true }
          }
        ]
      }
    ]
  }
}