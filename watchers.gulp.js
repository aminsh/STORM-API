"use strict";

const gulp = require("gulp"),
      gulpChug = require("gulp-chug"),
      chalk = require("chalk");

const tasks = [
    // Admin Tasks
    {
        name: "admin-build-template",
        globs: ["./admin/client/**/*.html"]
    },
    {
        name: "admin-build-js",
        globs: [
            "./admin/client/**/*.js",
            "./admin/app.client.config.js"
        ]
    },
    {
        name: "admin-build-sass",
        globs: [
            "./shared/styles/admin.scss",
            "./shared/styles/admin.components/**/*.*",
            "./shared/styles/_general.scss",
            "./shared/styles/general.components/**/*.*",
            "./shared/styles/resources/**/*.*"
        ]
    },
    // Invoice Tasks
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