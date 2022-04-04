const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// env 為package.json script 傳入的變數
module.exports = (env) => {
  return {
    // webpack-dev-server 的設定
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 9000,
    },
    // 啟用source-map 以利於偵錯
    devtool: "source-map",
    // 路徑片段轉換
    resolve: {
      // 因src 資料夾路徑為相對路徑，透過定義alias 模擬打包後dist root path
      alias: {
        "/assets": "/src/assets",
        "/js": "/src/js",
        "/styles": "/src/styles",
      },
    },
    // 進入點
    // entry: "./src/main.js",
    entry: {
      // 對應到Layout page
      main: "./src/main.js",
      // 對應到Home/Index
      "home-index": "./src/js/pages/home/home-index.js",
    },
    // 輸出路徑
    output: {
      // 因各作業系統路徑不同，使用path __dirname 輔助
      path: path.resolve(__dirname, "dist"),
      // 在MVC 的情況下
      // path: path.resolve(__dirname, '..', 'wwwroot'),
      // 輸出打包js 檔案名，並加入hash 避免瀏覽器快取
      // filename: "js/[name].[contenthash].js",
      filename:
        env.MODE == "production"
          ? "js/[name].bundle.min.js"
          : "js/[name].bundle.js",
      // publicPath: "/",
    },
    // 要加入的模組
    module: {
      rules: [
        // 功能：Babel 轉譯
        {
          // 讀取檔名有.js 的檔案
          test: /\.m?js$/,
          // 排除的檔案
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        // 功能二之一：引入CSS, SCSS 至JS，生成<style> append至<head>
        //   {
        //     test: /\.(css|s[ac]ss)$/i,
        //     use: [
        //       "style-loader",
        //       "css-loader",
        //       // SCSS 轉譯
        //       "sass-loader",
        //     ],
        //   },

        // 功能：引入CSS, SCSS 至JS，單獨輸出成css 檔案
        {
          //讀取檔名含有.css, .sass, .scss 的檔案
          test: /\.(css|s[ac]ss)$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },

        // 功能：讓靜態圖檔能正確被引用
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            // 定義輸出路徑與檔名，拿掉src path
            filename: (content) => {
              return content.filename.replace("src", "");
            },
          },
          // loader: "file-loader",
          // options: {
          //   // path 會從src 開始
          //   name: "[path][name].[ext]",
          //   // 定義context 拿掉src path
          //   context: "src",
          // },
        },

        // 功能：讓字型檔能正確被引用
        // {
        //   test: /(\.(ttf|woff|eot)$|iconfont\.svg)/,
        //   loader: "file-loader",
        //   options: {
        //     name: "[path][name].[ext]",
        //     context: "src",
        //   },
        // },

        // 功能：讓字型檔能正確被引用 (webpack 5)，對應webpack 4 的file loader
        {
          test: /\.(woff(2)?|ttf|eot)$/,
          type: "asset/resource",
          generator: {
            // 定義輸出路徑與檔名，拿掉src path
            filename: (content) => {
              return content.filename.replace("src", "");
            },
          },
        },

        // 功能：決定圖片載入方式及壓縮，需注意此模組不會引用未在JS 的資源
        // {
        //   test: /\.(jpe?g|png|gif|svg)$/,
        //   use: [
        //     // 需先安裝file-loader 才能正確使用
        //     // 圖片載入方式
        //     {
        //       loader: "url-loader",
        //       options: {
        //         // 若小於40kb 則轉成base 64，大於則一樣透過src 引入
        //         limit: 40000,
        //         // 如果不設定name 屬性，預設檔名會是hash 值
        //         name: "assets/images/[name].[ext]",
        //       },
        //     },
        //     // 圖片壓縮
        //     {
        //       loader: "image-webpack-loader",
        //       options: {
        //         // 只在 production 環境啟用壓縮
        //         disable: process.env.NODE_ENV === "production" ? false : true,
        //       },
        //     },
        //   ],
        // },

        // 功能：讓在HTML 上引入的靜態資源能正確打包
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
      ],
    },
    optimization: {
      minimizer: [
        // 壓縮JS
        new TerserPlugin({
          // 預設會產出關於JS 的License txt，把它取消
          extractComments: false,
        }),
        // 壓縮CSS
        new CssMinimizerPlugin(),
        // 圖片壓縮失真
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.squooshMinify,
            options: {
              encodeOptions: {
                mozjpeg: {
                  quality: 70,
                },
                webp: {
                  lossless: 1,
                },
                avif: {
                  cqLevel: 0,
                },
              },
            },
          },
        }),
      ],
      // 是否在devlopment 環境也要進行壓縮
      // minimize: true,
    },
    // 創建插件實例
    plugins: [
      new MiniCssExtractPlugin({
        // 輸出CSS 的路徑與名稱，並加入hash 避免瀏覽器快取
        // filename: "styles/main.[contenthash].css",
        filename:
          env.MODE == "production"
            ? "styles/[name].min.css"
            : "styles/[name].css",
      }),
      // 輸出引入資源後的 HTML
      new HtmlWebpackPlugin({
        // 選擇HTML 樣板
        template: "./src/index.html",
        // 輸出名稱
        filename: "home.html",
        // 選擇entries
        chunks: ["main", "home-index"],
      }),
      new HtmlWebpackPlugin({
        // 生成引入資源後的 HTML 與配置名稱
        template: "./src/index.html",
        filename: "main.html",
        chunks: ["main"],
      }),
      // 引入jQuery
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
      // 不會因為沒被引用而不在dist裡，複製src 資料夾到dist
      new CopyWebpackPlugin({
        patterns: [{ from: "src/assets", to: "assets" }],
      }),
    ],
  };
};
