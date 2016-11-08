var gulp = require('gulp'),
  sass = require('gulp-sass'), //Подключаем Sass пакет
  browserSync = require('browser-sync'), // Подключаем Browser Sync
  concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
  uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
  cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
  rename = require('gulp-rename'), // Подключаем библиотеку для переименования
  del = require('del'), // Подключаем библиотеку для удаления файлов и папок
  imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
  pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
  cache = require('gulp-cache') // Подключаем библиотеку кеширования
  autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов


gulp.task('scss', function(){ // Создаем таск Scss
  return gulp.src('app/sass/**/*.scss') // Берем источник
  .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
  .pipe(gulp.dest('dist/css')) // Выгружаем результата в папку dist/css
  .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('js', function(){ // Создаем таск js
  return gulp.src('app/js/**/*.js') // Берем источник
  .pipe(concat('script.min.js')) // Собираем их в кучу в новом файле script.min.js
  .pipe(uglify()) // Сжимаем JS файл
  .pipe(gulp.dest('dist/js')) // Выгружаем результата в папку
  .pipe(browserSync.reload({stream: true})) // Обновляем js на странице при изменении
});

gulp.task('html', function(){
  return gulp.src('app/*.html')
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
  browserSync({ // Выполняем browser Sync
    server: { // Определяем параметры сервера
      baseDir: 'dist' // Директория для сервера - app
    },
    notify: false // Отключаем уведомления
  });
});

gulp.task('scripts', function() {
  return gulp.src([ // Берем все необходимые библиотеки
    'app/libs/jquery.min.js', // Берем jQuery
    'app/libs/jquery.magnific-popup.min.js' // Берем Magnific Popup
  ])
  .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
  .pipe(uglify()) // Сжимаем JS файл
  .pipe(gulp.dest('dist/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['scss'], function() {
  return gulp.src('app/dist/css/libs.css') // Выбираем файл для минификации
  .pipe(cssnano()) // Сжимаем
  .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
  .pipe(gulp.dest('app/dist/css')); // Выгружаем в папку app/css
});


gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
  gulp.watch('app/sass/**/*.scss', ['scss']); // Наблюдение за scss файлами в папке sass
  gulp.watch('app/*.html', ['html'], browserSync.reload); // Наблюдение за HTML файлами в корне проекта
  gulp.watch('app/js/**/*.js', ['js'], browserSync.reload); // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
  return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*') // Берем все изображения из app
  .pipe(cache(imagemin({ /// Сжимаем их с наилучшими настройками с учетом кеширования
  interlaced: true,
  progressive: true,
  svgoPlugins: [{removeViewBox: false}],
  use: [pngquant()]
})))
  .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});


gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
  var buildCss = gulp.src([ // Переносим CSS стили в продакшен
  'app/css/main.css',
  'app/css/libs.min.css'
  ])
  .pipe(gulp.dest('dist/css'))
  var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
  .pipe(gulp.dest('dist/fonts'))
  var buildJs = gulp.src('app/js/dist/**/*') // Переносим скрипты в продакшен
  .pipe(gulp.dest('dist/js'))
  var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);

gulp.task('clear', function () {
  return cache.clearAll();
});
