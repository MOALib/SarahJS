const child_process = require("child_process");

const gulp = require("gulp");
const plumber = require("gulp-plumber");

const babel = require("gulp-babel");
const babel_config = require("./babel.config.json");

const files = {
    "out": "./dist_lib/sarah.js",
    "browser": "./dist_lib/sarah.browser.js",
    "browser_min": "./dist_lib/sarah.browser.min.js",
    "min": "./dist_lib/sarah.min.js",
};

function build(_donecb){
    // compile with babel

    return(
        gulp.src("src/**/*.js").pipe(plumber())
        .pipe(babel(babel_config)).pipe(gulp.dest("./dist_lib"))
    );
}

function minify(donecb){
    child_process.execSync(`npm exec minify ${files.out} > ${files.min}`);

    donecb();
}

function minify_browser(donecb){
    child_process.execSync(`npm exec minify ${files.browser} > ${files.browser_min}`);

    donecb();
}

function browserify(donecb){
    child_process.execSync(`npm exec browserify ${files.out} > ${files.browser}`);

    donecb();
}

exports.build = build;
exports.minify = minify;
exports.browserify = browserify;
exports.minify_browser = minify_browser;
exports.default = gulp.series(build, minify, browserify, minify_browser);