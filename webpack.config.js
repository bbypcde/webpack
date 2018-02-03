const path=require('path');
const devServer=require('webpack-dev-server');
const HtmlPlugin=require("html-webpack-plugin");
const ExtractTextPlugin=require("extract-text-webpack-plugin");
const UglifyJsPlugin=require("uglifyjs-webpack-plugin");
const glob=require('glob');
const PurifyCSSPlugin=require('purifycss-webpack');
const webpack=require('webpack');
const entry=require('./webpack_config/entry_webpack.js');
module.exports={
    // entry:{
    //     index:'./src/index.js'
    // },
    //以上入口文件配置放在entry_webpack.js模块中了，等于单提出来，用模块化配置入口也行，不用也ok
    //出口文件设置
    entry:entry,
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js',
        //下方指向dist文件
        publicPath:'http://localhost:8081'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
               // use:['style-loader','css-loader']
               use:ExtractTextPlugin.extract({
                   fallback:"style-loader",
                   //use:"css-loader"
                   use:[{
                       loader:'css-loader',
                       options:{importLoaders:1}
                   },'postcss-loader']
               })
            },{
                test:/\.(png|jpg|gif)/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:500,
                        outputPath:'/images/'
                    }
                }]
            },{
                test:/\.html$/i,
                use:['html-withimg-loader']
            },{
                test:/\.scss$/,
               // use:['style-loader','css-loader','sass-loader']
                 use:ExtractTextPlugin.extract({
                fallback:"style-loader",
                use:["css-loader",'sass-loader']
             })
            },{
                test:/\.js$/,
                use:[{
                    loader:'babel-loader',
                    options:{
                        presets:['env']
                    }
                }],
                exclude: '/node_modules/'
            }
        ]
    },
    plugins:[
         new HtmlPlugin({
             //去掉属性的双引号
             minify:{
                 removeAttributeQuotes:true
             },
             hash:true,
             template:"./src/index.html"
             //chunks:(如果js入口文件多个，可以选择一个入口，则html会只引用此选择的js文件)
         }),
         //把目标js文件中的css文件分离出来，以上的目标文件均为打包后的文件
         new ExtractTextPlugin("css/index.css"),
         //new UglifyJsPlugin(),
         new PurifyCSSPlugin({
             paths:glob.sync("./src/index.html")
         }),
         new webpack.BannerPlugin('京影精英'),
         new webpack.ProvidePlugin({
             $:'jquery'
         })

    ],
    devServer:{
        contentBase:path.resolve(__dirname,'dist'),
        host:'localhost',
        port:8081

    }
}