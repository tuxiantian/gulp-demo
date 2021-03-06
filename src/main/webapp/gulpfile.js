var gulp = require('gulp'),
	runSequence = require('run-sequence'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	csslint = require('gulp-csslint'),
	rev = require('gulp-rev'),
	minifyCss = require('gulp-minify-css'),
	changed = require('gulp-changed'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	revCollector = require('gulp-rev-collector'),
	minifyHtml = require('gulp-minify-html'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),
	connect = require('gulp-connect'),
	es2015=require('babel-preset-es2015'),
	babel =require('gulp-babel');

var cssSrc = ['main.less', 'layer-box.less', 'tag.less'],
	cssDest = 'dist/rev/css',
	jsSrc = 'src/js/*.js',
	jsDest = 'dist/rev/js',
	fontSrc = 'src/fonts/*',
	fontDest = 'dist/font',
	imgSrc = 'src/img/*',
	imgDest = 'dist/img',
	cssRevSrc = 'src/css/revCss',
	condition = true;

function changePath(basePath) {
	var nowCssSrc = [];
	for (var i = 0; i < cssSrc.length; i++) {
		nowCssSrc.push(cssRevSrc + '/' + cssSrc[i]);
		console.log(nowCssSrc)
	}
	return nowCssSrc;
}
gulp.task('babel',function(){
	return gulp.src('src/js/es6.js').pipe(babel({presets:[es2015]})).pipe(gulp.dest('dist/js/'));
})
//Fonts & Images 根据MD5获取版本号
gulp.task('revFont', function() {
	return gulp.src(fontSrc)
		.pipe(rev())
		.pipe(gulp.dest(fontDest))
		.pipe(rev.manifest())
		.pipe(gulp.dest('src/rev/font'));
});
gulp.task('revImg', function() {
	return gulp.src(imgSrc)
		.pipe(rev())
		.pipe(gulp.dest(imgDest))
		.pipe(rev.manifest())
		.pipe(gulp.dest('src/rev/img'));
});
//检测JS
gulp.task('lintJs', function() {
	return gulp.src(jsSrc)
		// .pipe(jscs()) //检测JS风格
		// .pipe(jshint({
		// 	"undef": false,
		// 	"unused": false
		// }))
		//.pipe(jshint.reporter('default'))  //错误默认提示.pipe(jshint.reporter(stylish))   //高亮提示.pipe(jshint.reporter('fail'));
});
//压缩JS/生成版本号
gulp.task('miniJs', function() {
	return gulp.src(jsSrc)
		.pipe(gulpif(
			condition, uglify()
		))
		.pipe(rev())
		.pipe(gulp.dest(jsDest))
		.pipe(rev.manifest())
		.pipe(gulp.dest('src/rev/js'));
});
//CSS里更新引入文件版本号
gulp.task('revCollectorCss', function() {
	return gulp.src(['src/rev/**/*.json', 'src/css/*.less'])
		.pipe(revCollector())
		.pipe(gulp.dest(cssRevSrc));
});
//检测CSS
gulp.task('lintCss', function() {
	return gulp.src(cssSrc)
		.pipe(csslint())
		.pipe(csslint.reporter())
		.pipe(csslint.failReporter());
});
//压缩/合并CSS/生成版本号
gulp.task('miniCss', function() {
	console.log('this is miniCss')
	console.log(changePath(cssRevSrc))
	return gulp.src(changePath(cssRevSrc))
		.pipe(less())
		.pipe(gulpif(
			condition, minifyCss({
				compatibility: 'ie7'
			})
		))
		.pipe(rev())
		.pipe(gulpif(
			condition, changed(cssDest)
		))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false,
			remove: false
		}))
		.pipe(gulp.dest(cssDest))
		.pipe(rev.manifest())
		.pipe(gulp.dest('src/rev/css'));
});
//压缩Html/更新引入文件版本
gulp.task('miniHtml', function() {
	return gulp.src(['src/rev/**/*.json', 'src/*.html'])
		.pipe(revCollector())
		.pipe(gulpif(
			condition, minifyHtml({
				empty: true,
				spare: true,
				quotes: true
			})
		))
		.pipe(gulp.dest('dist'));
});
// gulp.task('delRevCss', function() {
// 		del([cssRevSrc, cssRevSrc.replace('src/', 'dist/')]);
// 	})
// 	//意外出错？清除缓存文件
// gulp.task('clean', function() {
// 		del([cssRevSrc, cssRevSrc.replace('src/', 'dist/')]);
// 	})
	gulp.task('clean-temp',function(){
		del(['E:/eclipse/gulp-demo/src/main/webapp/dist/rev/js/js/jquery-1.11.3.js','E:/eclipse/gulp-demo/src/main/webapp/dist/rev/js/js/main.js'])
	})
//开发构建
gulp.task('dev', function(done) {
	condition = false;
	runSequence(
		['revFont', 'revImg'], ['lintJs'], ['revCollectorCss'], ['miniCss', 'miniJs'], ['miniHtml'],
		done);
});
//正式构建
gulp.task('build', function(done) {
	runSequence(
		['revFont', 'revImg'], ['lintJs'], ['revCollectorCss'], ['miniCss', 'miniJs'], ['miniHtml'], done);
});
gulp.task('default', ['build']);

gulp.task('watch-css', function() {
	gulp.watch('./src/css/**/*.less', function() {
		return gulp.src('./src/css/**/*.less').pipe(less()).pipe(rev()).pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false,
			remove: false
		})).pipe(gulp.dest(cssDest))
	})
})
gulp.task('watch-js', function() {
	gulp.watch(['./src/js/**/*.js', '!./src/js/**/jquery.js'], function() {
		return gulp.src(['./src/js/**/*.js', '!./src/js/**/jquery.js']).pipe(gulpif(
				condition, uglify()
			))
			.pipe(rev())
			.pipe(gulp.dest(jsDest))
			.pipe(rev.manifest())
			.pipe(gulp.dest('src/rev/js'));
	})
})
gulp.task('connect', function() {
	connect.server({
		port: 3000,
		root: './dist/'
	})
})

gulp.task('connect-all', ['connect', 'watch-js', 'watch-css'])