'use strict';


const { src, dest, parallel, series, watch } = require('gulp');
const        sass     = require('gulp-sass');
const        pug      = require('gulp-pug');
const        concat   = require('gulp-concat');
const        imagemin = require('gulp-imagemin');
const        newer    = require('gulp-newer');
const        del      = require('del');
const        uglify   = require('gulp-uglify');
const  autoprefixer   = require('gulp-autoprefixer');
const  browserSync    = require('browser-sync').create();
const  rsync          = require('gulp-rsync');
const  babel          = require("gulp-babel");



function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/vue/dist/vue.min.js',
    'node_modules/vue-router/dist/vue-router.min.js',

    'src/js/main.js'
  ])
  .pipe(concat('app.min.js')) // Конкатенируем в один файл
  .pipe(babel())
	.pipe(uglify()) // Сжимаем JavaScript
	.pipe(dest('dest/js/')) // Выгружаем готовый файл в папку назначения
	.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
  return src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(dest('dest/css'))
    .pipe(browserSync.stream())
}

function pugToHtml() {
  return src('src/pug/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(dest('dest'))
    .pipe(browserSync.stream())
}

function images() {
  return src('src/images/**/*')
    .pipe(newer('dest/images'))
    .pipe(imagemin())
    .pipe(dest('dest/images'))
}

function cleanimg() {
  return del('dest/images/**/*', { force: true })
}

function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'dest' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}

function startwatch() {
  watch('src/**/*.js', scripts);
  watch('src/**/*.scss', styles);
  watch('src/images/**/*', images);
  watch('src/**/*.pug', pugToHtml).on('change', browserSync.reload);
}

function deploy() {
  return src('dest/**')
    .pipe(rsync({
      root: 'dest/',
      hostname: 'root@194.67.109.32',
      destination: '/home/admin/web/testodomen.ru/public_html/',
      recursive: true,
      archive: true,
      silent: false,
      compress: true
  }));
}

// exports.default = series(styles, pugToHtml, browserSync);


exports.browsersync      =  browsersync;
exports.styles           =  styles;
exports.images           =  images;
exports.cleanimg         =  cleanimg;
exports.scripts          =  scripts;
exports.pugToHtml        =  pugToHtml;
exports.deploy           =  deploy;

exports.default = parallel(scripts, styles, pugToHtml, browsersync, startwatch);

