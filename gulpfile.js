'use strict';

var gulp = require('gulp'); 
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');  
var useref = require('gulp-useref');        
var htmlmin = require('gulp-htmlmin');      
var image = require('gulp-image');          
var gulpif = require('gulp-if');            
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var browserSync = require('browser-sync');

/*============ DIST ============*/

gulp.task('index:dist', function(){
	return gulp.src('./src/index.html')
		   // объеденяем css файлы, которые помеченные комментами в index.html
		   .pipe(useref())
		   // минифицыруем css файлы
		   .pipe(gulpif('*.css', cleanCss()))
		   // сжимаем html код
		   .pipe(htmlmin({ collapseWhitespace: true, cleanCss: true, minifyJS: true, removeComments: true}))
		   // добавляем хеш-значение к имени файла css
		   .pipe(gulpif('*.css', rev()))
		   .pipe(revReplace())
		   // отправляем все в папку dist
		   .pipe(gulp.dest('./dist'))
		 })

// минифиципуем картинки
gulp.task('img:dist', function(){
    return gulp.src('./src/img/**/*.*')
        .pipe(image())
        .pipe(gulp.dest('./dist/img'))
})


// копируем шрифты
gulp.task('fonts:dist', function(){
	return gulp.src('./src/fonts/*.*')
		   .pipe(gulp.dest('./dist/fonts'))
})

// копируем шрифт font-awesome  //если нужно
// gulp.task('fontawesome:dist', function(){
// 	return gulp.src('./src/components/font-awesome/fonts/*.*')
// 		   .pipe(gulp.dest('./dist/fonts'))
// })

// компилим sass
gulp.task('sass', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./src/css'));
});

// задача которая компилит наш проект в dist
gulp.task('dist', function (cb) {
  runSequence('sass', 'index:dist', 'img:dist', 'fonts:dist', cb); // добавить 'fontawesome:dist' если нужно
});

/*============ Watch ============*/

// отслеживаем изменения scss файлов и если они меняются - запускаем компилятор
gulp.task('sass:watch', function () {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});

gulp.task('watch', function(cb){
	runSequence('sass', 'sass:watch', cb);
});

/*============ Serve ============*/

// запустить браузер с папки src
gulp.task('serve', ['watch'], function(){
	startBrowser('./src/');
})

// запустить браузер с папки dist
gulp.task('serve-dist', ['dist'], function(){
	startBrowser('./dist/');
})

function startBrowser(srcPath){
	var options = {
        port: 3000,
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'Site',
        notify: true,
        reloadDelay: 0,
        online: false,
        server: {
        	baseDir: [srcPath]
        },
        files: [
        	srcPath + 'css/*.css'
        ]
    };
    browserSync(options);
}

/*============ Default ============*/

gulp.task('default', ['serve']);