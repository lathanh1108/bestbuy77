const { src, dest, watch, series } = require('gulp')
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const clean = require('gulp-clean');

const filesPath = {
    scss: 'src/assets/scss/*.scss',
    fonts: 'src/assets/fonts/**/*.*',
    images: 'src/assets/images/**/*.*',
    js: 'src/assets/js/*.js',
    jsLibrary: 'src/assets/js/libraries/*.js',
};

const filesPathTarget = {
    scss: 'public/stylesheets',
    fonts: 'public/fonts',
    images: 'public/images',
    js: 'public/javascripts',
};

const filesPathWatch = {
    scss: 'src/assets/scss/**/*.scss',
    js: 'src/assets/js/**/*.js',
};

function scssTask(mode = null) {
    var processors = null;

    if (mode == 'prod') {
        processors = [
            autoprefixer,
            cssnano
        ];
    } else {
        processors = [
            autoprefixer
        ];
    }

    return src(filesPath.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(concat('style.css'))
        .pipe(dest(filesPathTarget.scss));
}

function jsTask() {
    return src([filesPath.jsLibrary, filesPath.js])
        .pipe(concat('app.js'))
        .pipe(dest(filesPathTarget.js));
}

function fontTask() {
    return src(filesPath.fonts)
        .pipe(dest(filesPathTarget.fonts));
}

function imageTask() {
    return src(filesPath.images)
        .pipe(dest(filesPathTarget.images));
}

function defaultClean() {
    return src('public').pipe(clean());
}

function build(cb) {
    scssTask();
    jsTask();
    fontTask();
    imageTask();
    cb();
}

function serve() {
    watch(filesPathWatch.scss, scssTask);
    watch(filesPathWatch.js, jsTask);
}

function production(cb) {
    scssTask('production');
    jsTask();
    fontTask();
    imageTask();
    cb();
}

exports.default = series(defaultClean ,build);
exports.production = series(defaultClean ,production)
exports.serve = series(defaultClean, build, serve);