const webpack = require('webpack');
const path = require('path');
const outdir = './dist';

module.exports = {
  entry: {
    app: './app/index.js',
    libs: ['react', 'react-dom', 'ramda'],
  },

  output: {
    filename: path.join(outdir, 'app.bundle.js'),
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'libs',
      filename: path.join(outdir, 'libs.bundle.js'),
      // with more entries, this ensures that no other module goes into the
      //  vendor chunk
      minChunks: Infinity,
    }),
  ],

  devtool: 'source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
      },
    ],

    preLoaders: [
      { test: /\.js$/, loader: 'source-map-loader' }
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  // },
};
