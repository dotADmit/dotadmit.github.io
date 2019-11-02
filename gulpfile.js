const gulp = require('gulp');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
const sass = require('gulp-sass');

const path = {
    html: ['*.html', '_includes/*.html', '_layouts/*.html'],
    scss: 'scss/**/*.scss'
};


gulp.task('jekyll:build', function (done) {
    gulp.parallel(
        'sass'
    )
    return spawn('jekyll', ['build'], {
        shell: true,
        stdio: 'inherit'
    }).on('close', done);
});
/*
gulp.task('jekyll:build', function (done) {
    exec('jekyll build', function (error, stdout, stderr) {
        if (error) {
            console.log('exec error ${error}');
            return;
        }
        console.log('exec stdout ${stdout} \n ${stdout.length}');
        console.log('exec stderr ${stderr} \n ${stderr.length');
        done();
     })
    });*/

gulp.task('browser-sync',gulp.series('jekyll:build',function () {
    bs.init({
        server: {
            baseDir: "_site"
        }
    });
}));

gulp.task('sass', function () {
    return gulp.src('scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('_site/assets/styles'))
        .pipe(bs.stream())
        .pipe(gulp.dest('assets/styles'));
});

gulp.task('jekyll:rebuild',gulp.parallel('jekyll:build', function (done) {
    bs.reload();
    done();
}));

gulp.task('watch', function () {
    gulp.watch(path.html, gulp.parallel('jekyll:rebuild'));
    gulp.watch(path.scss, gulp.parallel('sass'));
});

gulp.task('serve', gulp.parallel('browser-sync', 'watch'));