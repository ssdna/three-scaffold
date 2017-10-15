const gulp = require('gulp');

const eslint = require('gulp-eslint');

gulp.task('lint', () => {
    return gulp.src(['src/*.js', '!node_modules/**'])
        .pipe(eslint('.eslintrc.js'))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint'], () => {
    console.log('All tasks completed successfully.');
})
