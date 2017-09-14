const path = require('path'),
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    Util = require('gulp-util'),

    environmentVariables = require('./eviroment.json'),

    knex = require('knex')({
        client: 'pg',
        connection: environmentVariables.DATABASE_URL,
        debug: false
    }),
    options = {
        migrations: path.resolve(`${__dirname}/migrations`),
        tableName: 'accounitng_schema_migrations',
        seeds: {directory: path.resolve(`${__dirname}/seeds`)}
    };

require('./array.prototypes');

gulp.task('run-server', function () {

    nodemon({
        script: 'app.js'
        , ext: 'js html'
        , exec: 'forever start'
        , env: environmentVariables
    });

});


gulp.task('migrate-latest', () => {
    knex.migrate.latest(options)
        .then(results => {
            if (results[1].length === 0) {
                Util.log(Util.colors.gray('No migrations to run'));
            } else {
                Util.log(Util.colors.green.bold(`Migrating group ${results[0]}`));
                results[1].forEach(migration_path => {
                    Util.log('\t', Util.colors.green(migration_path.replace(path.dirname(options.migrations), '')));
                });
            }

            process.exit();
        })
        .catch(err => {
            Util.log(Util.colors.red(err));
            process.exit();
        });
});
