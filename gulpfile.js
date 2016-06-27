var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var connect = require('gulp-connect');
var mainBowerFiles = require('main-bower-files');
var proxy = require('http-proxy-middleware');
var gulpCopy = require('gulp-copy');
var rename = require('gulp-rename');
var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass','copy' ,'index','bwc','connect']);

gulp.task('connect', function () {
  connect.server({
    root: ['./www'],
    port: 9000,
    livereload: true,
    debug:true,
    middleware: function (connect, opt) {
      return [
        proxy('/rest', {
          target: 'http://ec2-54-72-132-102.eu-west-1.compute.amazonaws.com:8080/emedics-0.1.0',
          changeOrigin:true
        })
      ]
    }
  });
});

gulp.task('copy', function () {
 return  gulp.src("./www/index.tpl.html")
  .pipe(rename("./www/index.html")).pipe(gulp.dest('.'));

});

gulp.task('index',['copy'], function () {

  var target = gulp.src('www/index.html');
  var sources = gulp.src(['./www/js/**/*.js', './www/css/**/*.css']); //{read: false}

  return target.pipe(inject(sources,{relative: true}))
    .pipe(gulp.dest('./www/'));
});

gulp.task('bwc',['index'], function () {
  var target = gulp.src('www/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:

  return target.pipe(inject(gulp.src(mainBowerFiles(), {base: './www/lib'}), {name:'bower',relative: true}))
    .pipe(gulp.dest('./www/'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
