const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const webpack     = require('webpack-stream');
const prod = process.env.NODE_ENV === 'production';
const browserSync = require('browser-sync');
const server = browserSync.create();
const plumber = require('gulp-plumber');
const connect = require('gulp-connect-php');

const paths = {
    sass: {
        src: 'src/scss/*.scss',
        dest: 'build/css/'
    },
    html: {
        src: 'src/*.html',
        dest: 'build/'
    },
    js: {
        src: 'src/js/*.js',
        dest: 'build/js/'
    },
    php : {
        src: 'src/*.php',
        dest: 'build/'
    }
}

function html() {
    return gulp.src(paths.html.src)
    .pipe(plumber())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(server.stream())
}
function php() {
    return gulp.src(paths.php.src)
    .pipe(gulp.dest(paths.php.dest))
    .pipe(server.stream())
}
function js() {
    return gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(webpack({
        mode: prod ? 'production' : 'development',
        devtool: prod ? false : 'eval',
        output: {
            filename: 'app.js',
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }]
        }
    }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(server.stream())
}

//compile scss into css
function styles() {
    return gulp.src(paths.sass.src)
    .pipe(plumber())
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(server.stream())
}


gulp.task('serve', function() {
    return connect.server({
      base: './build',
      port: '3000',
    }, function(){browserSync({
            baseDir: "./build",
            proxy: '127.0.0.1:3000'
    })});
});

function reload(done) {
    browserSync.reload();
    done();
}
gulp.task('watch', function() {
    gulp.watch(paths.html.src, gulp.series(html, reload));
    gulp.watch(paths.js.src, gulp.series(js, reload));
    gulp.watch(paths.sass.src, gulp.series(styles, reload));
    gulp.watch(paths.php.src, gulp.series(php, reload));
});

exports.sass = sass;
exports.js = js;
exports.html = html;
exports.php = php;
exports.build = gulp.series(html, styles, js, php);
exports.watchServe = gulp.parallel('watch', 'serve');
