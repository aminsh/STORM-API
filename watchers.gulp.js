"use strict";

const gulp = require("gulp"),
      gulpChug = require("gulp-chug"),
      chalk = require("chalk");

const taskGroups = [
    // Accounting Group
    {
        name: "acc",
        tasks: [
            {
                name: "build-template",
                globs: [
                    "./accounting/client/partials/**/*.*",
                    "./accounting/client/src/**/*.html",
                ]
            },
            {
                name: "build-js",
                globs: ["./accounting/client/src/**/*.js"]
            },
            {
                name: "build-sass",
                globs: ["./accounting/client/src/styles/**/*.*"]
            }
        ]
    },
    // Admin Group
    {
        name: "admin",
        tasks: [
            {
                name: "build-template",
                globs: ["./admin/client/**/*.html"]
            },
            {
                name: "build-js",
                globs: [
                    "./admin/client/**/*.js",
                    "./admin/app.client.config.js"
                ]
            },
            {
                name: "build-sass",
                globs: [
                    "./shared/styles/admin.scss",
                    "./shared/styles/admin.components/**/*.*",
                    "./shared/styles/_general.scss",
                    "./shared/styles/general.components/**/*.*",
                    "./shared/styles/resources/**/*.*"
                ]
            }
        ]
    },
    // Invoice Group
    {
        name: "invoice",
        tasks: [
            {
                name: "build-template",
                globs: ["./invoice/**/*.html"]
            },
            {
                name: "build-js",
                globs: [
                    "./invoice/app.client.config.js",
                    "./invoice/client/*.js"
                ]
            },
            {
                name: "build-sass",
                globs: [
                    "./shared/styles/invoice.scss",
                    "./shared/styles/_general.scss",
                    "./shared/styles/general.components/**/*.*",
                    "./shared/styles/resources/**/*.*"
                ]
            }
        ]
    },
];

let allTaskNames = [];


taskGroups.forEach(group => {

    let thisGroupName = `wch::${group.name}`;
    let groupAllTaskNames = [];

    group.tasks.forEach(task => {

        let thisTaskName = `wch::${group.name}::${task.name}`;
        let externalTaskName = `${group.name}-${task.name}`;

        gulp.task(thisTaskName, () => {

            declareWatcherEvent(
                externalTaskName,
                task.globs
            );

        });

        groupAllTaskNames.push(thisTaskName);

    });

    allTaskNames.push(thisGroupName);

    gulp.task(thisGroupName, groupAllTaskNames);

});



function declareWatcherEvent(name, globs){

    let watcher = gulp.watch(globs, () =>
        gulp
            .src("./gulpfile.js")
            .pipe(gulpChug({ tasks: [name] }))
    );

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



gulp.task('default', allTaskNames);