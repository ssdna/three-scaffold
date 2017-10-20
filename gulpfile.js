const del = require('del')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const gutil = require('gulp-util')
const mocha = require('gulp-mocha')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const changed = require('gulp-changed')
const plumber = require('gulp-plumber')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const cleanCSS = require('gulp-clean-css')
const cssimport = require('gulp-cssimport')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')

// const minimist = require('minimist')
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
  images: 'src/textures/**/*',
  html: 'src/index.html',
  css: 'src/css/*.css',
  js: ['src/**/*.js'],
  staticResources: [
    'src/lib/**',
    './node_modules/three/build/three.min.js'
  ]
}

/**
 * options
 */
const options = {
  env: 'development',
  devDest: 'dist',
  prodDest: 'build'
}
// const options = minimist(process.argv.slice(2), {
//   string: 'env',
//   default: {env: process.env.NODE_ENV || 'production'}
// })
const browserifyOptions = {
  entries: ['src/main.js'],
  ignore: ['src/libs/**'],
  transform: [['babelify', {presets: ['env'], ignore: ['src/libs/**']}]],
  debug: true
}
const watchifyOptions = assign({}, watchify.args, browserifyOptions)
const b = watchify(browserify(watchifyOptions))
/**
 * watchify bundle
 * @returns
 */
function bundle () {
  const isDev = (options.env === 'development')
  const dest = isDev ? options.devDest : options.prodDest
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(!isDev, uglify()))
    .pipe(gulpif(isDev, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(isDev, sourcemaps.write('./')))
    .pipe(gulpif(!isDev, rename({ extname: '.min.js' })))
    .pipe(gulp.dest(dest))
    .pipe(gulpif(isDev, browserSync.reload({stream: true})))
    // .pipe(gulpif(!isDev, b.close()))
}

/**
 * bundle task, for browserify + watchify
 */
gulp.task('js', ['eslint'], bundle)
b.on('update', bundle) // on any dep update, runs the bundler
b.on('log', gutil.log) // output build logs to terminal
b.on('error', gutil.log) // output build logs to terminal

/**
 * clean task
 */
gulp.task('clean', (done) => {
  const isDev = (options.env === 'development')
  const dest = isDev ? options.devDest : options.prodDest
  del.sync(`${dest}/**/*`)
  done()
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
gulp.task('copy', ['clean'], function () {
  const isDev = (options.env === 'development')
  const dest = isDev ? options.devDest : options.prodDest
  return gulp.src(paths.staticResources)
    .pipe(plumber())
    .pipe(gulp.dest(`${dest}/static`))
})

/**
 * image task, minify images
 */
gulp.task('image', ['clean'], function () {
  const isDev = (options.env === 'development')
  const dest = isDev ? options.devDest : options.prodDest
  return gulp.src(paths.images)
    .pipe(plumber())
    .pipe(gulpif(!isDev, imagemin({optimizationLevel: 5})))
    .pipe(gulp.dest(`${dest}/image`))
})

/**
 * css task, del & move index.html
 */
gulp.task('css', () => {
  const isDev = (options.env === 'development')
  const dest = isDev ? options.devDest : options.prodDest
  return gulp.src(paths.css)
    .pipe(plumber())
    .pipe(changed(`${dest}/css`))
    .pipe(cssimport())
    // .pipe(autoprefixer('last 5 versions'))
    .pipe(gulpif(!isDev, autoprefixer('last 5 versions')))
    .pipe(concat('style.css'))
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(gulpif(!isDev, cleanCSS()))
    .pipe(gulpif(isDev, sourcemaps.write('.')))
    .pipe(gulpif(!isDev, rename({ extname: '.min.css' })))
    .pipe(gulp.dest(`${dest}/css`))
})

/**
 * html task, del & move index.html
 */
gulp.task('html', () => {
  const isDev = (options.env === 'development')
  const dest = isDev ? options.devDest : options.prodDest
  return gulp.src(paths.html)
    .pipe(plumber())
    .pipe(changed(dest))
    .pipe(gulpif(!isDev, htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest(dest))
})

/**
 * refresh task, refresh index.html
 */
gulp.task('refresh', ['html', 'css'], (done) => {
  browserSync.reload()
  done()
})

/**
 * browser-sync task, browser-sync for dev server
 */
gulp.task('browser-sync', ['html', 'js'], () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
  const watcher = gulp.watch([paths.html, paths.css], ['refresh'])
  watcher.on('change', function (event) {
    console.log(`    File ${event.path} was ${event.type} changed, running tasks...`)
  })
})

/**
 * mocha task TODO: fix es6 in *.test.js
 */
gulp.task('test', () => {
  // browserify({
  //   entries: ['tests/*.test.js']
  // })
  //   .transform('babelify', {presets: ['env']})
  //   .bundle()
  //   .on('error', gutil.log.bind(gutil))
  return gulp.src(['tests/*.test.js'])
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log)
})

/**
 * set development mode task
 */
gulp.task('development', (done) => {
  options.env = 'development'
  gutil.log(`
    set '${gutil.colors.cyan('env')}' to '${gutil.colors.magenta(options.env)}' `)
  done()
})

/**
 * dev task
 */
gulp.task('dev', ['development', 'browser-sync', 'copy', 'image', 'css'], (done) => {
  gutil.log(gutil.colors.cyan('Development Mode'), ' starting...')
  done()
})

/**
 * set production mode task
 */
gulp.task('production', (done) => {
  options.env = 'production'
  gutil.log(`
    set '${gutil.colors.cyan('env')}' to '${gutil.colors.magenta(options.env)}' `)
  done()
})

/**
 * build task
 */
gulp.task('build', ['production', 'js', 'html', 'copy', 'image', 'css'], (done) => {
  gutil.log(`
    ${gutil.colors.cyan('Build success')}! Please check directory: [${gutil.colors.magenta('build')}] `)
  b.close()
  done()
})

/**
 * default -- help task
 */
gulp.task('default', () => {
  gutil.log(`
  ${gutil.colors.green('Supported Commonds')} :
  --------------------------------
    ${gutil.colors.green('gulp dev')}   : starting dev-server
    ${gutil.colors.green('gulp build')} : build TODO...
    ${gutil.colors.green('gulp test')}  : TODO...
  --------------------------------
  `)
})
