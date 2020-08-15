// var { src, dest, watch } = require('gulp');
// var postcss = require('gulp-postcss');
// var pxtoviewport = require('postcss-px-to-viewport');




const {src, dest, watch, series} = require('gulp');
///////////插件///////////////
// var postcss = require('gulp-postcss');

const sass = require('gulp-sass');
// const px2rem = require('gulp-px2rem');
var pxtoviewport = require('postcss-px-to-viewport');

const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();


//sass/scss转css////////////////////
const sassout = () => {
	return src('sass/*.scss')
		.pipe(sass()).pipe(dest('dist/'));

}

//////////px转vw//////////////////
//参数 一定是一个数组
var option = [
	pxtoviewport({
		unitToConvert: 'px', //希望把什么单位转为vw
		viewportWidth: 640, //设计稿尺寸
		unitPrecision: 5, //小数点后几位
		propList: ['*'], //希望把什么属性转为 vw
		viewportUnit: 'vw', //转换的单位是 vw | vh
		fontViewportUnit: 'vw', //文字转换为 什么单位
		selectorBlackList: [], //黑名单-不编译的
		minPixelValue: 1, //小于多少不转换
		mediaQuery: false, //媒体查询
		replace: true, //替换

		//后面四个 基本上我们用不上，可以直接删掉
		// exclude: [],
		// landscape: false,
		// landscapeUnit: 'vw',
		// landscapeWidth: 568
	})
];

var px2vw = () => {
	return src('dist/*.css')
		.pipe(postcss(option))
		.pipe(dest('style/'));
}
////////////css压缩////////////////
// const mini = () => {
// 	return src('./style/*.css')
// 		.pipe(cleanCSS({compatibility: '*'}))
// 		.pipe(dest('./mini/'))
// }

//3 开启服务器
const fw = () => {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
}
// 4 监听sass变化，输出 csspx 再 输出 cssrem 再刷新浏览器

//////////////////监听文件夹,按顺序调用/////////////////////
const wat = () => {
	fw();
	// watch('./sass/*.scss', series(sassout, pxrem, browserSync.reload));
	watch('sass/*.scss', series(sassout, px2vw));
	watch(['style/*.css', '*.html', './js/*.js']).on('change', browserSync.reload);
}

exports.wat = wat;




// exports.px = px2vw;





