var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');

var configureSetup  = {
    createModule: false,
    constants: {
        gmkey: process.env.GMKEY,
    }
};

gulp.task('config', function() {
    gulp.src('config.json')
    .pipe(gulpNgConfig('meanhotel', configureSetup))
    .pipe(gulp.dest('public/angular-app')); 
});