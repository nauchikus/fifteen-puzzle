const path = require( "path" );

const HtmlWebpackPlugin = require( "html-webpack-plugin" );



module.exports = {
  experiments: {
    // outputModule: true,
    // topLevelAwait: true,
  },
  target: `web`,
  mode: process.env.NODE_ENV,

  context: path.join(process.cwd()),

  entry: {
    index: path.resolve(`./src/index.ts`)
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(process.cwd(), 'public'),
    clean: {
      keep(asset) {
        return asset.includes('assets');
      },
    }
  },
  externals:{
    gsap: 'gsap',
    [`pixi.js`]: "PIXI",
  },
  stats: `errors-only`,


  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: path.join(process.cwd(), `src`, `index.html`),
      inject: false
    })
  ],
  devServer: {
    static: {
      directory: path.join(process.cwd(), 'public'),
    },
    compress: true,
    port: 5500,
  },
}