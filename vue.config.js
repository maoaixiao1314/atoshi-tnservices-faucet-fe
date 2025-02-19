const { defineConfig } = require('@vue/cli-service')
const path = require("path");
const port = process.env.port || process.env.npm_config_port || 8088; // port
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  transpileDependencies: true,
  // Deploy URLs in production and development environments.
  // By default, Vue cli will assume that your application is deployed on the root path of a domain name
  // For example https://www.trustslink.com/ 。 If the application is deployed on a sub path, you need to specify the sub path with this option. For example, if your application is deployed in https://www.trustslink.com/admin/ , set baseurl to / admin /.
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // When NPM run build or yarn build, the directory name of the generated file (consistent with the production environment path of baseurl) (default dist)
  outputDir: 'dist',
  // Used to place the generated static resources (JS, CSS, IMG, fonts); (after the project is packaged, the static resources will be placed in this folder)
  assetsDir: 'static',
  // Whether to enable eslint save detection. Valid values: true | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // If you don't need the source map of the production environment, you can set it to false to speed up the construction of the production environment.
  productionSourceMap: false,
  // webpack-dev-server config
  devServer: {
    host: '0.0.0.0',
    port: port,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://54.169.234.21:3009',
        // target: `https://172.16.104.227:3001`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: process.env.VUE_APP_BASE_API
        }
      }
    },
    allowedHosts: 'all',
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
})
