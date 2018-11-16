// @flow

// Used to be:
// browserify -d -p [minifyify --map app.js.map --output gen/app.js.map] js/app.js -o gen/app.js
// ...but then it got too complicated, and this seemed easier

const babelify = require("babelify");
const browserify = require("browserify");
const blacklistify = require("blacklistify/custom");
const envify = require("envify/custom");
const fs = require("fs");

console.log("Bundling JavaScript files...");

const BLACKLIST = {
    ui: [/.*\/worker.*/],
    worker: [/.*\/ui.*/, /.*react.*/],
};

let sport = process.env.SPORT;
if (typeof sport !== "string") {
    sport = "basketball";
}

for (const name of ["ui", "worker"]) {
    browserify(`src/${sport}/${name}/index.js`, { debug: true })
        .on("error", console.error)
        .transform(babelify)
        .transform(blacklistify(BLACKLIST[name]))
        .transform(envify({ NODE_ENV: "production", SPORT: sport }), {
            global: true,
        })
        .bundle()
        .pipe(fs.createWriteStream(`build/gen/${name}.js`));
}
