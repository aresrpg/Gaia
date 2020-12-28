const webpack = require('webpack')
// const path = require('path');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    // entry: { worker: './node_modules/prismarine-viewer/viewer/lib/worker.js' },
    // output: { filename: '[name].js' },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        // eslint-disable-next-line
        /viewer[\/|\\]lib[\/|\\]utils/,
        './utils.web.js'
      )
    ],
    
  },
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].excludeChunks = ['worker']
      return args
    })
  }
  // pluginOptions: {
  //   configureMultiCompilerWebpack: [
  //     {},
  //     {
  //       entry: './node_modules/prismarine-viewer/viewer/lib/worker.js',
  //       mode: 'production',
  //       output: {
  //         path: path.join(__dirname, '/public'),
  //         filename: './worker.js'
  //       },
  //       plugins: [
  //         // fix "process is not defined" error:
  //         new webpack.ProvidePlugin({
  //           process: 'process/browser'
  //         }),
  //         new webpack.ProvidePlugin({
  //           Buffer: ['buffer', 'Buffer']
  //         })
  //       ]
  //     }
  //   ]
  // }
}
