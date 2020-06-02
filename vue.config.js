// vue.config.js
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

const port = 9527

module.exports = {
  publicPath: '/', // 基本路径
  outputDir: 'dist', // 构建时的输出目录
  assetsDir: 'static', // 放置静态资源的目录
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false, //  是否为生产环境构建生成 source map
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8080/',
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  chainWebpack: config => {
    // 一个规则里的 基础Loader
    // svg是个基础loader
    const svgRule = config.module.rule('svg')

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()

    // 添加要替换的 loader
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  // 当项目逐渐变大之后，文件与文件直接的引用关系会很复杂，这时候就需要使用alias 了
  // 改变src为@(import a from @/** */)
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    /* name: name, */
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
