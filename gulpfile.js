'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    sh = require('shelljs'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    mainBowerFiles = require('main-bower-files'),
    proxy = require('http-proxy-middleware'),
    rename = require('gulp-rename'),
    paths = {
      sass: ['./scss/**/*.scss'],
      src:['./main-js/**/*', './public/**/*', './dashboard/**/*']
    };

gulp.task('default', ['sass','copy' ,'index','bwc', 'connect']);

gulp.task('connect', function () {
  connect.server({
    root: ['./www'],
    port: 9000,
    livereload: true,
    debug:false,
    middleware: function (connect, opt) {
      return [
        proxy('/rest', {
          //target: 'http://ec2-54-72-132-102.eu-west-1.compute.amazonaws.com:8080/emedics-0.1.0',
          target:'http://192.168.20.252:8080/emedics-0.1.0',
          changeOrigin:true
        })
      ];
    }
  });
});

gulp.task('copy', function () {
 return  gulp.src("./www/index.tpl.html")
  .pipe(rename("./www/index.html")).pipe(gulp.dest('.'));

});

gulp.task('index',['copy'], function () {

  var target = gulp.src('www/index.html');
  var sources = gulp.src([
    './www/main-js/app1.js',
    './www/main-js/core.emedics2.js',
    './www/main-js/**/*.js',
 './www/public/public-core.js',
    './www/public/**/*.js',

    './www/public/controllers/**/*.js',

    './www/dashboard/**/*.js',

    './www/dashboard/controllers/**/*.js',

    './www/css/**/*.css']);

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


/*gulp.task('watch', function() {
  //gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.src);
});*/

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
