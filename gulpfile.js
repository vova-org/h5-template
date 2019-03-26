var gulp = require('gulp')
var less = require('gulp-less')
var uglify = require('gulp-uglify')
var browserSync = require('browser-sync').create()
var runSequence = require('run-sequence')
const path = require('path')
const proxy = require('http-proxy-middleware')
const rm = require('rimraf').sync
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var babel = require("gulp-babel");
var cssmin = require('gulp-minify-css');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
// var imageMin = require('gulp-imagemin');
var px2rem = require('gulp-rem-plugin');
var eslint = require('gulp-eslint');

const filePath = path.resolve(__dirname,'./');

var paths = {
  scripts: `${filePath}/src/js/*.js`,
  images: `${filePath}/src/images/*.{png,jpg,jpeg,ico,gif}`,
  css: `${filePath}/src/css/*.{less,css}`,
  html: `${filePath}/src/**/*.html`,
  lib: `${filePath}/src/lib/*.js`
};

rm(path.join(process.cwd(),'dist'));

var autoprefix = new LessPluginAutoPrefix({
  browsers: [
    "ie >= 8",
    "ie_mob >= 10",
    "ff >= 26",
    "chrome >= 30",
    "safari >= 6",
    "opera >= 23",
    "ios >= 5",
    "android >= 2.3",
    "bb >= 10"
  ]
})

const proxyOption = proxy('/api',{
  target: '/',
  changeOrigin: true,
})

gulp.task('server', () => {
  var files = [
    '**/*.html',
    '**/img/*',
    '**/css/*.css',
    '**/js/*.js'
  ];
  browserSync.init(files, {
      server: {
        baseDir: "dist",
        // middleware: mock.data()
      },
      port: 8002,
      startPath: '/',
      middleware: [proxyOption],
      logLevel: "info",
      notify: false,
      open: "external",
      ghostMode: false
  });
});

gulp.task('html', () => {
  return gulp.src(paths.html)
      .pipe(gulp.dest('dist'))
})

gulp.task('js:lib', () => {
  return gulp.src(paths.lib)
    .pipe(gulp.dest('./dist/js'))
});


gulp.task('js:lint', () => {
    return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    // .pipe(eslint.formatEach('compact', process.stderr));
})


gulp.task('js:dev', () => {
  return gulp.src(paths.scripts)
    .pipe(plumber({errorHandler: notify.onError('Error:<%=error.message%>')}))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('js:build', () => {
  return gulp.src(paths.scripts)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('lessTask', () => {
  return gulp.src(paths.css)
    .pipe(plumber({errorHandler: notify.onError('Error:<%=error.message%>')}))
    .pipe(less({
      includePaths: ['less'],
      plugins: [autoprefix]
    }))
    .pipe(cssmin({compatibility: 'ie7'}))
    .pipe(px2rem({'width_design': 750,'valid_num': 4,'pieces': 10,'ignore_px': [1],'ignore_selector': ['@media']}))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('images',() => {
  return gulp.src(paths.images)
    // .pipe(imageMin({interlaced: true, progressive: true, optimizationLevel: 5,}))
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('reload', () => {
  return browserSync.reload();
})


gulp.task('watch', () => {
  gulp.watch(paths.images, () => runSequence('images','reload'));
  gulp.watch(paths.css, () => runSequence('lessTask','reload'));
  gulp.watch(paths.html, () => runSequence('html','reload'));
  gulp.watch(paths.scripts, () => runSequence('js:dev', 'js:lint', 'reload'));
});
gulp.task('default', () => runSequence(['lessTask','images','js:dev', 'js:lib', 'js:lint'],'html','watch','server'));
gulp.task('dev', () => runSequence(['lessTask','images','js:dev', 'js:lib', 'js:lint'],'html','watch','server'));
gulp.task('build', () => runSequence(['lessTask','images','js:build', 'js:lib'],'html'));