const gulp = require('gulp');

const del = require('del');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const paths = {
  scripts: ['app/**/*.js'],
  images: 'app/img/**/*'
};

gulp.task('clean', () => {
  return del(['build']);
})

gulp.task('eslint', () => {
  return gulp.src(['app/*.js', '!node_modules/**'])
    .pipe(eslint('.eslintrc.js'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('scripts', ['eslint'], () => {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'));
})

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

gulp.task('js-watch', ['scripts'], (done) => {
  browserSync.reload();
  done();
})

gulp.task('browser-sync', ['scripts'], () => {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });

  gulp.watch('app/*.js', ['js-watch']);
})

gulp.task('default', ['browser-sync', 'js-watch'], () => {
    console.log('All tasks completed successfully.');
})
