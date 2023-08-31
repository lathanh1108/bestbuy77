const { src, dest, watch, series } = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const merge = require('merge-stream');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const clean = require('gulp-clean');


require('dotenv').config();

const srcPath = 'src/assets';
const publicPath = 'public';

const filesPath = {
    css: `${srcPath}/scss`,
    js: `${srcPath}/js`,
};

const librariesPath = {
    js: `${srcPath}/js/libraries/*`,
    css: `${srcPath}/scss/libraries/*`,
}

const assetsPath = {
    fonts: `${srcPath}/fonts/*`,
    images: `${srcPath}/images/*`
}

const filesPathTarget = {
    css: `${publicPath}/css`,
    js: `${publicPath}/js`,
    fonts: `${publicPath}/fonts`,
    images: `${publicPath}/images`,
};

function js() {
    var b = browserify({
        entries: `${filesPath.js}/app.js`,
        debug: false
    });

    var javascript = b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        // .pipe(uglify())
        .pipe(dest(filesPathTarget.js));

    var libraries = src(librariesPath.js)
        .pipe(dest(filesPathTarget.js));

    return merge(javascript, libraries);
}

function css() {
    var processors = null;

    if (process.env.NODE_ENV == 'production') {
        processors = [
            autoprefixer,
            cssnano
        ];
    } else {
        processors = [
            autoprefixer
        ];
    }

    var scss = src(`${filesPath.css}/index.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(concat('style.css'))
        .pipe(dest(filesPathTarget.css));

    var libraries = src(librariesPath.css)
        .pipe(dest(filesPathTarget.css));

    return merge(scss, libraries)
}

function asset() {
    var fonts = src(assetsPath.fonts)
        .pipe(dest(filesPathTarget.fonts));

    var images = src(assetsPath.images)
        .pipe(dest(filesPathTarget.images));

    return merge(fonts, images);
}

function defaultClean() {
    return src(publicPath, { allowEmpty: true }).pipe(clean());
}

function build(cb) {
    js();
    css();
    asset();
    cb();
}

function serve() {
    watch(`${filesPath.css}/**`, css);
    watch(`${filesPath.js}/**`, js);
}

exports.default = series(defaultClean, build);
exports.serve = series(defaultClean, build, serve);