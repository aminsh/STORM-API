"use strict";

require('../server/utilities/string.prototypes');
require('../server/utilities/array.prototypes');

const gulp = require('gulp'),
    path = require('path'),
    Util = require('gulp-util'),
    knex = require('knex')({
        client: 'pg',
        connection: 'postgres://postgres:P@ssw0rd@localhost:5432/dbAccFRK',
        debug: true
    }),
    options = {
        migrations: path.resolve(`${__dirname}/database/migrations`),
        tableName: 'accounitng_schema_migrations',
        seeds: {directory: path.resolve(`${__dirname}/database/seeds`)}
    },
    argv = require('yargs').argv,
    fs = require('fs'),
    mssql = require('./convert/connection/mssql'),
    convertConfig = require('./convert/config.json'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    data = require('./convert/models/data');

gulp.task('make-migrate', () => {
    let filename = (argv.filename)
        ? `accounting_migrate_db_${argv.filename}`
        : 'accounting_migrate_db';

    knex.migrate.make(filename, options)
        .then(migration_path => {
            Util.log('Created new migration',
                Util.colors.green(migration_path.replace(options.directory, '')));
            process.exit();
        })
        .catch(err => Util.log(Util.colors.red(err.message)));
});

gulp.task('migrate-latest', () => {
    knex.migrate.latest(options)
        .then(results => {
            if (results[1].length == 0) {
                Util.log(Util.colors.gray('No migrations to run'));
            } else {
                Util.log(Util.colors.green.bold(`Migrating group ${results[0]}`));
                results[1].forEach(migration_path => {
                    Util.log('\t', Util.colors.green(migration_path.replace(path.dirname(options.directory), '')));
                });
            }

            process.exit();
        })
        .catch(err => {
            Util.log(Util.colors.red(err));
            process.exit();
        });
});

gulp.task('migrate-rollback', ()=> {
    knex.migrate.rollback(options)
        .then(()=> process.exit())
        .catch((err)=> {
            Util.log(Util.colors.red(err));
            process.exit();
        });
});

gulp.task('migrate-version', () => {
    knex.migrate.currentVersion(options).then(version => {
        if (version == 'none') {
            Util.log(Util.colors.gray('No migrations have been run'));
        } else {
            Util.log('Database is at version', Util.colors.green(version));
        }
        process.exit();
    });
});

gulp.task('make-seed', () => {
    let seedname = (argv.name)
        ? `accounting_seed_${argv.name}`
        : 'accounting_seed';

    knex.seed.make(seedname, options)
        .then(() => {
            Util.log(Util.colors.green('seed file created successfully'));
            process.exit();
        });
});

gulp.task('run-seed', ()=> {
    knex.seed.run().then(()=> {
        Util.log(Util.colors.green('seed ran successfully'));
        process.exit();
    });
});

gulp.task('make-json-converted', async(() => {
    const executionOrdering = convertConfig['execution-ordering'],
        dataFileName = convertConfig['data-file-name'];

    Util.log(Util.colors.gray('source database started to connect'));
    await(mssql.connect);
    Util.log(Util.colors.green('source database connected successfully '));

    executionOrdering.forEach(modelName => {
        let Convertor = require(`./convert/convertors/${modelName}.convertor`);
        Util.log(Util.colors.gray(`${modelName} converting is starting `));
        await(new Convertor().execute());
        Util.log(Util.colors.gray(`${modelName} converting is finished `));
    });

    Util.log(Util.colors.green('Data are read from source successfully '));

    fs.writeFile(
        path.normalize(__dirname + dataFileName),
        JSON.stringify(data), err => {
            if (err) {
                Util.log(Util.colors.red(err));
                return process.exit()
            }

            Util.log(Util.colors.green('Data file json is created'));
            process.exit();
        });
}));

