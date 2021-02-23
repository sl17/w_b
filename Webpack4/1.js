const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { use } = require("chai");
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/build.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          //创建style标签，将样式放入
          // 'style-loader',
          /*
          MiniCssExtractPlugin.loader 取代style-loader，
          作用：提取js中的css变成单独文件
          需要下载 mini-css-extract-plugin插件 运行 npm i mini-css-extract-plugin -D
          */
          MiniCssExtractPlugin.loader,
          'css-losder',
          /*
          css做兼容处理：postcss 运行 npm i postcss-loader postcss-preset-env -D
          postcss-preset-env帮助postcss找到package.json中的browserslist里面的配置，通过配置加载指定的css兼容性
          所以对package.json做配置
          "dependencies": {
            ...
           },
           "browserslist": {
             //开发环境
             "development": [
               "last 1 chrome version",//最近版本的谷歌浏览器兼容
               "last 1 firefox version",//最近版本的火狐浏览器兼容
               "last 1 safari version"//最近版本的苹果浏览器兼容
             ],
             "production": [
               ">0.2%",//大于99.8%的浏览器
               "not dead",//不兼容已经下线的浏览器 例如：ie10
               "not op_mini all",//op_mini早已下线，国内没有
             ]
           }
           更多browserslist配置，github搜索
           使用的默认配置
           'postcss-loader'
           修改配置的写法 ↓
           */
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                //postcss的插件
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      },
      /*
        语法检查：eslint-loader eslint
          注意：只检查自己写的源代码，不检查第三方的库
          规则：package.json中的eslintConfig中设置
          "dependencies": {
           ...
          },
          "eslintConfig": {
            "extends": "airbnb-base"
          }
          需要用airbnb 下载运行npm i eslint eslint-config-airbnb-base eslint-plugin-import -D
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,//排除node_modules中的js
        loader: 'eslint-loader',
        options: {
          //自动修复eslint的错误
          fix: true
        }
      },
      /*
        1、基本的兼容处理
          js兼容性处理：babel-loader 
          下载运行 npm i babel-loader @babel/core @babel/preset-env -D
        2.全部的js兼容处理
          体积大，比较暴力，会把所有的语法全部兼容
          下载运行 npm i @babel/polyfill -D
          在入口文件 index.js引入即可 import '@babel/polyfill'
        3.需要做兼容的就做，按需加载
          下载运行 npm i core-js -D
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,//排除node_modules中的js
        loader: 'babel-loader',
        options: {

          /*
            方案一
            预设: 指示babel做什么样的兼容性处理
            presets: ['@babel/preset-env']
          */
         /*
            方案三
            按需加载
          */
         presets: [
           [
             '@babel/preset-env',
             {
               //按需加载
               useBuiltIns: 'usage',
               //制定core-js版本
               corejs: {
                 version: 3
               },
               //制定兼容性做到哪个浏览器版本以上
               targets: {
                chrome: '60',
                firefox: '60',
                ie: '9',
                safari: '10',
                edge: '17'
               }
             }
           ]
         ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      //压缩html
      minify: {
        //移除空格
        collapseWhitespace: true,
        //移除注释
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      //生成的文件名叫build.css，放在build/css下
      filename: 'css/build.css'
    }),
    // optimize-css-assets-webpack-plugin 压缩css的插件 运行 npm i optimize-css-assets-webpack-plugin -D
    //压缩css
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'development'
}