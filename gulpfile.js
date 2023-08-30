const { src, dest, watch, series } = require('gulp')
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const clean = require('gulp-clean');

const filesPath = {
    scss: 'src/assets/scss/*.scss',
    fonts: 'src/assets/fonts/**',
    images: 'src/assets/images/**',
    js: 'src/assets/js/*.js',
    jsLibraries: 'src/assets/js/libraries/*',
    cssLibraries: 'src/assets/scss/libraries/*',
};

const filesPathTarget = {
    scss: 'public/css',
    fonts: 'public/fonts',
    images: 'public/images',
    js: 'public/js',
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
    return src([filesPath.js])
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

function copyJsLibraries() {
    return src(filesPath.jsLibraries)
        .pipe(dest(filesPathTarget.js));
}

function copyCssLibraries() {
    return src(filesPath.cssLibraries)
        .pipe(dest(filesPathTarget.scss));
}

function copyAssets() {
    copyJsLibraries();
    copyCssLibraries();
    fontTask();
    imageTask();
}

function defaultClean() {
    return src('public').pipe(clean());
}

function build(cb) {
    scssTask();
    jsTask();
    copyAssets();
    cb();
}

function serve() {
    watch(filesPathWatch.scss, scssTask);
    watch(filesPathWatch.js, jsTask);
}

function production(cb) {
    scssTask('production');
    jsTask();
    copyAssets();
    cb();
}

exports.default = series(defaultClean, build);
exports.production = series(defaultClean, production)
exports.serve = series(defaultClean, build, serve);