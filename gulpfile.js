import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import csso from "postcss-csso";
import del from "del";
import gulp from "gulp";
import gulpIf from "gulp-if";
import imagemin from "gulp-imagemin";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import rename from "gulp-rename";
import sass from "gulp-dart-sass";
import svgo from "gulp-svgmin";
import twig from "gulp-twig";
import webp from "gulp-webp";

const IS_DEV = process.env.NODE_ENV === "development";

// Styles

export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: IS_DEV })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// HTML

const html = () => {
  return gulp.src("source/twig/*.twig")
    .pipe(twig())
    .pipe(gulp.dest("build"));
};

// Scripts

const scripts = () => {
  return gulp
    .src("source/js/*.js")
    .pipe(gulp.dest("build/js"))
    .pipe(browser.stream());
};

// Images

const images = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(gulpIf(!IS_DEV, imagemin()))
    .pipe(gulp.dest("build/img"))
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
};

// SVG

const svg = () =>
  gulp
    .src(["source/img/**/*.svg", "!source/img/sprite.svg"])
    .pipe(svgo())
    .pipe(gulp.dest("build/img"));

const sprite = () => {
  return gulp
    .src("source/img/sprite.svg")
    .pipe(gulp.dest("build/img"));
};

// Copy

const copy = (done) => {
  gulp
    .src(["source/fonts/*.{woff2,woff}", "source/img/favicon/*.ico"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
  done();
};

// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Reload

const reload = (done) => {
  browser.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch("source/twig/**/*.twig", gulp.series(html, reload));
};

// Build

export const build = gulp.series(clean, gulp.parallel(copy, images, styles, html, scripts, svg, sprite));

// Default

export default gulp.series(build, server, watcher);
