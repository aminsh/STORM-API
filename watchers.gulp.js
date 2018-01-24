"use strict";

const gulp = require("gulp"),
      gulpChug = require("gulp-chug"),
      chalk = require("chalk");

const tasks = [
    {
        name: "invoice-build-template",
        globs: ["./invoice/**/*.html"]
    },
    {
        name: "invoice-build-js",
        globs: [
            "./invoice/app.client.config.js",
            "./invoice/client/*.js"
        ]
    },
    {
        name: "invoice-build-sass",
        globs: [
            "./shared/styles/invoice.scss",
            "./shared/styles/_general.scss",
            "./shared/styles/general.components/**/*.*",
            "./shared/styles/resources/**/*.*"
        ]
    }
];

let taskNames = [];


tasks.forEach(task => {

    gulp.task(`watcher::${task.name}`, () => {

        declareWatcherEvent(
            task.name,
            gulp.watch(task.globs, () =>
                gulp
                    .src("./gulpfile.js")
                    .pipe(
                        gulpChug({
                            tasks: [task.name]
                        })
                    )
            )
        );

    });

    taskNames.push(`watcher::${task.name}`);

});



function declareWatcherEvent(name, watcher){

    watcher
        .on(
            "change",
            stat => console.log(
                "( " + chalk.yellowBright(name) + " ) >> "
                + chalk.yellowBright("Changed") + " >> Path: "
                + chalk.blue(stat.path)
            )
        )
        .on(
            "unlink",
            stat => console.log(
                "( " + chalk.magenta(name) + " ) >> "
                + chalk.magenta("Changed") + " >> Path: "
                + chalk.redBright(stat.path)
            )
        );

}



gulp.task('default', taskNames);