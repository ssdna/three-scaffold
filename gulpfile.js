const gulp = require('gulp')
const plumber = require('gulp-plumber')

const del = require('del')
const gutil = require('gulp-util')
const eslint = require('gulp-eslint')
// const concat = require('gulp-concat')
// const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const sourcemaps = require('gulp-sourcemaps')
const watchify = require('watchify')
const browserify = require('browserify')
const browserSync = require('browser-sync').create()
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const assign = require('lodash.assign')

/**
 * paths
 */
const paths = {
  scripts: ['src/**/*.js'],
  images: 'src/textures/**/*',
  html: './src/index.html',
  staticResources: [
    'src/lib/**',
    './node_modules/three/build/three.min.js'
  ]
}

/**
 * browserify options
 */
const browserifyOptions = {
  entries: ['src/main.js'],
  ignore: ['src/libs/**'],
  transform: [['babelify', {presets: ['env'], ignore: ['src/libs/**']}]],
  debug: true
}
const opts = assign({}, watchify.args, browserifyOptions)
const b = watchify(browserify(opts))
/**
 * watchify bundle
 * @returns
 */
function bundle () {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(uglify())
    // loads map from browserify file
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}))
}

/**
 * bundle task, for browserify + watchify
 */
gulp.task('bundle', ['eslint'], bundle)
b.on('update', bundle) // on any dep update, runs the bundler
b.on('log', gutil.log) // output build logs to terminal
b.on('error', gutil.log) // output build logs to terminal

/**
 * clean task
 */
gulp.task('clean', () => {
  del.sync('dist/**/*')
})

/**
 * eslint task
 */
gulp.task('eslint', () => {
  return gulp.src(['src/**/*.js', '!node_modules/**'])
    .pipe(eslint('.eslintrc.js'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

/**
 * static-resources task, copy static resources directly
 */
gulp.task('static-resources', ['clean'], function () {
  return gulp.src(paths.staticResources)
    .pipe(plumber())
    .pipe(gulp.dest('dist/statics'))
})

/**
 * image task, minify images
 */
gulp.task('image', ['clean'], function () {
  return gulp.src(paths.images)
    .pipe(plumber())
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/img'))
})

/**
 * html task, del & move index.html
 */
gulp.task('html', function () {
  del.sync('dist/index.html')
  return gulp.src(['src/index.html'])
    .pipe(plumber())
    .pipe(gulp.dest('dist'))
})

/**
 * refresh task, refresh index.html
 */
gulp.task('refresh', ['html'], function (done) {
  browserSync.reload()
  done()
})

/**
 * watch task, refresh index.html
 */
gulp.task('watch', ['html'], function () {
  const watcher = gulp.watch(paths.html, ['refresh'])
  watcher.on('change', function (event) {
    console.log('    File ' + event.path + ' was ' + event.type + ', running tasks...')
  })
})

/**
 * browser-sync task, browser-sync for dev server
 */
gulp.task('browser-sync', ['watch', 'bundle'], () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
  // gulp.watch('src/**', ['watch'])
})

/**
 * default task, All tasks completed successfully
 */
gulp.task('default', ['browser-sync', 'static-resources', 'image'], () => {
  console.log('All tasks completed successfully.')
})
