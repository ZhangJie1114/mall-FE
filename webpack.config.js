/*
* @Author: ZhangJie
* @Date:   2017-10-30 11:34:27
* @Last Modified by:   ZhangJie
* @Last Modified time: 2017-11-04 11:12:10
*/

/*独立通用模块*/
var webpack = require('webpack');
// webpack 1语法
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common','js/[name].js');
// webpack 3语法 webpack3 dev环境不支持提取css文件
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({names: ['common'],filename:'js/[name].js'});

/*css文件单独打包*/
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssPlugin = new ExtractTextPlugin("css/[name].css");

/*自动生成html模板*/
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 获取html-webpack-plugind参数的方法
var getHtmlConfig = function(name, title){
    return{
        // 定义html中title标签的属性
        title : title,
        // 引用的模板路径，template的路径前缀不要.号！不要.号！不要.号！
        template : 'src/view/'+ name +'.html', 
        // 生成出来的文件和路径，前面会加上output的path
        filename : 'view/'+ name +'.html',
        // 插入文件的位置
        inject : true,
        // 在生成的文件后面增加一个hash，防止缓存
        hash : true,
        //引入js的地址，里面的值就是entry里面的属性，在对应的页面里面引入想要的js即可，就可以多页面不同引用了 
        chunks : ['common',name]
        /* 
        参数详见: https://github.com/jantimon/html-webpack-plugin#third-party-addons
        You can pass a hash of configuration options to HtmlWebpackPlugin. Allowed values are as follows:
        
        title: The title to use for the generated HTML document.
        filename: The file to write the HTML to. Defaults to index.html. You can specify a subdirectory here too (eg: assets/admin.html).
        template: Webpack require path to the template. Please see the docs for details.
        inject: true | 'head' | 'body' | false Inject all assets into the given template or templateContent - When passing true or 'body' all javascript resources will be placed at the bottom of the body element. 'head' will place the scripts in the head element.
        favicon: Adds the given favicon path to the output html.
        minify: {...} | false Pass html-minifier's options as object to minify the output.
        hash: true | false if true then append a unique webpack compilation hash to all included scripts and CSS files. This is useful for cache busting.
        cache: true | false if true (default) try to emit the file only if it was changed.
        showErrors: true | false if true (default) errors details will be written into the HTML page.
        chunks: Allows you to add only some chunks (e.g. only the unit-test chunk)
        chunksSortMode: Allows to control how chunks should be sorted before they are included to the html. Allowed values: 'none' | 'auto' | 'dependency' |'manual' | {function} - default: 'auto'
        excludeChunks: Allows you to skip some chunks (e.g. don't add the unit-test chunk)
        xhtml: true | false If true render the link tags as self-closing, XHTML compliant. Default is false
        */
    }
};
// var htmlPlugin = new HtmlWebpackPlugin({
//     template : '.src/view/index.html', 
//     filename : 'view/index.html',
//     inject : true,
//     hash : true,
//     chunks : ['common','index']
    
// });

// webpack-dev-server的环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || "dev";
console.log(WEBPACK_ENV);

/*主配置信息*/
// const path = require('path');// webpack 3语法
var config = {
    // 插件项
    plugins: [
        commonsPlugin,
        cssPlugin,
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('login', '用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果'))
    ],
    // 页面入口文件配置
    entry: {
        'common' : './src/page/common/index.js',
        'index' : './src/page/index/index.js',
        'login' : './src/page/login/index.js',
        'result' : './src/page/result/index.js'
    },
    // 入口文件输出配置
    output: {
        // 输出文件目录，webpack 1语法  
        path: './dist/',

        // 输出文件目录，webpack 3语法
        // path: path.resolve(__dirname, 'dist'),
        
        // 源文件目录
        publicPath:'/dist/',

        filename: 'js/[name].js'
    },
    // jquery配置
    externals: {
        'jquery' : 'window.jQuery'
    },
    module: {
        // 加载器配置
        loaders: [
            // ExtractTextPlugin单独打包css的loader
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") },
            // 图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(png|jpg|gif|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=8192&name=resource/[name].[ext]'},
            // 加载.string模板文件
            { test: /\.string$/, loader: 'html-loader'}

            //默认css的loader
            // .scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            // { test: /\.css$/, loader: 'style-loader!css-loader' },
            // .js 文件使用 jsx-loader 来编译处理
            // { test: /\.js$/, loader: 'jsx-loader?harmony' },
            // .scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            // { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            // 图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            // { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },    
    // 其它解决方案配置
    resolve: {
        // root: 'D:/HtmlWorkSpace/webpack/src', //绝对路径
        // extensions: ['', '.js', '.json', '.scss'],
        // 路径别名
        alias: {
            node_modules : __dirname + '/node_modules',
            util : __dirname + '/src/util',
            page : __dirname + '/src/page',
            service : __dirname + '/src/service',
            image : __dirname + '/src/image'
        }
    }
};

// 给主配置的common追加参数
if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

// 需在引用的自定义主配置信息后边
module.exports = config;