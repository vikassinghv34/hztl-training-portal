const gulp = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const hb = require('gulp-hb');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const fs = require('file-system');
const replacePath = require('gulp-replace');
const fractal = require('./fractal.js');
const logger = fractal.cli.console;
let throughcustom = require('through2');

const htmlFilesArr = ['src/**/*.html'];

const cssFilesArr = [
  'src/Content/sass/style.scss'
];

// To combine custom and vendor js files in single js file use following array
const customandVendorjsFilesArr = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/slick-slider/slick/slick.min.js',
  'src/Content/scripts/**/*.js',
  'src/components/**/*.js',
  '!src/components/accordion/accordion.js'
];

// To have custom js files in separate js files use following array
const customjsFilesArr = [
  'src/components/accordion/accordion.js'
];

// To have vendor js files in separate js files use following array
const vendorjsFilesArr = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/slick-slider/slick/slick.min.js',
];

const replacepathObject = JSON.parse(fs.readFileSync('./config/component-config-map.json'));

function html() {
  return gulp
    .src(htmlFilesArr)
    .pipe(
      hb()
        .partials('./src/templates/partials/**/*.hbs')
        .partials('./src/components/**/*.hbs')
        .helpers('./src/templates/helpers/*.js')
        .data('./src/templates/data/**/*.{js,json}'),
    )
    .pipe(gulp.dest('./dist'));
}

function css() {
  return gulp
    .src(cssFilesArr)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: ['node_modules'],
      }).on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/Content/css/'));
}

function cssprod() {
  return gulp
    .src(cssFilesArr)
    .pipe(
      sass({
        includePaths: ['node_modules'],
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/Content/css/'));
}

function fonts() {
  return gulp
    .src('src/Content/fonts/**/*.*')
    .pipe(gulp.dest('dist/Content/fonts/'));
}

function icons() {
  var fontName = 'icons';
  return gulp
    .src(['src/Content/icons/*.svg'])
    .pipe(
      iconfontCss({
        fontName: fontName,
        targetPath: '../sass/_icons.scss',
        fontPath: '../fonts/',
      }),
    )
    .pipe(
      iconfont({
        fontName: fontName,
        // Remove woff2 if you get an ext error on compile
        // formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
        formats: ['svg', 'woff2'],
        normalize: true,
        fontHeight: 1001,
      }),
    )
    .pipe(gulp.dest('src/Content/fonts/'));
}

function js() {
  return gulp
    .src(customandVendorjsFilesArr, { allowEmpty: true })
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      }),
    )
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/Content/scripts'));
}

function jsprod() {
  return gulp
    .src(customandVendorjsFilesArr, { allowEmpty: true })
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      }),
    )
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/Content/scripts'));
}

function separatecustomjs() {
  return gulp
    .src(customjsFilesArr, { allowEmpty: true })
    .pipe(gulp.dest('dist/Content/scripts/custom-js'));
}

function vendorjs() {
  return gulp
    .src(vendorjsFilesArr, { allowEmpty: true })
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      }),
    )
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/Content/scripts'));
}

function separatevendorjs() {
  return gulp
    .src(vendorjsFilesArr, { allowEmpty: true })
    .pipe(gulp.dest('dist/Content/scripts/vendor'));
}

function img() {
  return gulp
    .src('src/Content/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/Content/images/'));
}

function serve() {
  browserSync.init({
    open: true,
    server: './dist',
    middleware: [
            {
                route: "/api/sitecore/testapi/test",
                handle: function (req, res, next) {
                    var data = JSON.parse(fs.readFileSync('routes/test-api/data.json'));
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data, '', 1));
                }
            }
        ]
  });
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watchFiles() {
  gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload));
  gulp.watch('src/**/*.hbs', gulp.series(html, browserSyncReload));
  gulp.watch('src/**/*.json', gulp.series(html, browserSyncReload));
  gulp.watch('src/**/*.scss', gulp.series(css, browserSyncReload));
  gulp.watch('src/**/*.js', gulp.series(js, browserSyncReload));
  gulp.watch('src/Content/images/**/*.*', gulp.series(img, browserSyncReload));

  return;
}

function del() {
  return gulp.src('dist/*', { read: false }).pipe(clean());
}

function staticCss() {
  return gulp
    .src('src/Content/sass/static.scss')
    .pipe(
      sass({
        includePaths: ['node_modules'],
      }).on('error', sass.logError),
    )
    .pipe(rename('unity-style.css'))
    .pipe(gulp.dest('dist/static/css/'));
}

function staticImg() {
  return gulp
    .src([
      'src/Content/images/logo.png',
    ])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/static/img/'));
}

/*
 *  Fractal Commands
 */
function cleanPatternComponentList() {
  return gulp.src('pattern-library-source/*', { read: false }).pipe(clean({ force: true }));
}

function addComponentsToLibrary() {
  return gulp
    .src('src/components/**/*.*')
    .pipe(replacePath('src="Content/images/', 'src="../../assets/images/'))
    .pipe(throughcustom.obj(function (file, enc, cb) {
      let strforReplace = file.contents.toString();
      replacepathObject.forEach(element => {
        strforReplace = strforReplace.replace(element.srcpath, element.key);
      });
      file.contents = Buffer.from(strforReplace);
      cb(null, file);
    }))
    .pipe(gulp.dest('pattern-library-source/'));
}

function addpreviewLayoutToLibrary() {
  return gulp
    .src('src/templates/pattern-library-layout/**/*.*')
    .pipe(gulp.dest('pattern-library-source/'));
}

gulp.task('fractal:build', function () {
  const builder = fractal.web.builder();
  builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
  builder.on('error', err => logger.error(err.message));
  return builder.build().then(() => {
    logger.success('Fractal build completed!');
  });
});

gulp.task('fractal:start', function () {
  const server = fractal.web.server({
    sync: true,
    port: 8080,
    open: true
  });
  server.on('error', err => logger.error(err.message));
  return server.start().then(() => {
    logger.success(`Fractal server is now running at ${server.urls.sync.local}`);
  });
});

////////////////////////////////////

exports.del = del;

exports.serve = gulp.parallel(
  html,
  icons,
  css,
  fonts,
  vendorjs,
  separatevendorjs,
  separatecustomjs,
  js,
  img,
  watchFiles,
  serve,
);
exports.prod = gulp.series(
  del,
  html,
  icons,
  css,
  cssprod,
  fonts,
  vendorjs,
  separatevendorjs,
  separatecustomjs,
  js,
  jsprod,
  img,
);
exports.icons = gulp.series(icons);
exports.static = gulp.series(staticCss, staticImg);
exports.default = gulp.series(
  del,
  html,
  icons,
  css,
  cssprod,
  fonts,
  vendorjs,
  separatevendorjs,
  separatecustomjs,
  js,
  jsprod,
  img,
);

// Pattern Library Task

exports.patternlibrary = gulp.series(
  del,
  html,
  icons,
  fonts,
  img,
  css,
  cssprod,
  vendorjs,
  separatevendorjs,
  separatecustomjs,
  js,
  jsprod,
  cleanPatternComponentList,
  addpreviewLayoutToLibrary,
  addComponentsToLibrary,
  'fractal:build',
  'fractal:start'
);
