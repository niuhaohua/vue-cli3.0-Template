const path = require('path')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const env = process.env.NODE_ENV;

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	devServer: {
		host: 'localhost',
		port: 8080,
		open: true,
		proxy: {
			'/asadms': {
				target: 'http://192.168.100.167:9097', //测试服务器
				// target: 'http://10.0.5.139:9097', //测试服务器
				
				//   target: 'http://10.0.5.61:9005', //测试服务器
				pathRewrite: {
					'^/asadms': ''
				},
				changeOrigin: true
			},
		}
	},
	publicPath: '/adms/',
	productionSourceMap: false,
	chainWebpack(config) {
		config.module
			.rule('svg')
			.exclude.add(resolve('src/assets/svg'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/assets/svg'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()
	},
	configureWebpack: (config) => {
		if (env !== 'development' || env !== 'test') {
			// config.plugins.push(new CompressionWebpackPlugin({
			// 	algorithm: 'gzip',
			// 	test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
			// 	threshold: 10240,
			// 	minRatio: 0.8,
			// }));
			config.plugins.push(
				// new UglifyJsPlugin({
				// 	uglifyOptions: {
				// 		compress: {
				// 			// warnings: false,
				// 			drop_debugger: true, // console
				// 			drop_console: true,
				// 			pure_funcs: ['console.log'] // 移除console
				// 		},
				// 	},
				// 	sourceMap: false,
				// 	parallel: true,
				// }),
			);
		}
	}
}