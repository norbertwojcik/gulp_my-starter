var gulp = require('gulp');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var minifCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify'); //minifikacja JS
var concat = require('gulp-concat'); //łączenie js i css w jeden plik
var include = require("gulp-include"); //dołacanie do pliku JS zewnętrznych skryptów
var imagemin = require('gulp-imagemin'); //kompresa plików graficznych
var changed = require('gulp-changed'); //sprawdza w któryh plikach graficznych zaszła zmiana
var htmlReaplce = require('gulp-html-replace'); //przetworzenie kilku plików css lub js w jeden  
                                                //CSS -> <!-- build:css --> PLIKI CSS <!-- endbuild -->  
                                                //JS->   <!-- build:js --> PLIKI JS <!-- endbuild  -->
var htmlMin = require('gulp-htmlmin'); //minifikacja HTML
var del = require('del'); //usuwanie
var sequence = require('run-sequence'); //kolejność wykonywania taksów




gulp.task('reload', function(){
	browserSync.reload();
});

gulp.task('serve', ['sass'], function() {
  browserSync({
    server: 'dist/'
  });

  gulp.watch(['src/*.html', 'src/js/**/*.js'], ['reload']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('img/*.jpg', ['img']);

});

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(compass({
			css: 'dist/css',
			sass: 'src/scss'
		}))
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(concat('style.css'))
    .pipe(minifCSS())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream());
});

gulp.task('js', function(){
	return gulp.src('src/js/**/*.js')
  .pipe(include({
        extensions: "js",
        hardFail: true,
        includePaths: [
            __dirname + "/node_modules"
        ]
  }))
	.pipe(concat('script-my.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'));
});


gulp.task('img', function() {
  return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}')
    .pipe(changed('dist/img/'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img/'));
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlReaplce({
      'css': 'css/style.css',
      'js': 'js/script-my.js'
    }))
    // .pipe(htmlMin({
    //   sortAttributes: true,
    //   sortClassName: true,
    //   collapseWhitespace: true
    // }))
    .pipe(gulp.dest('dist/'))
});


gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('build', function() {
  sequence('clean', ['html', 'js', 'sass', 'img']);
});

gulp.task('default', ['serve']);
 