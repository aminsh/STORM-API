"use strict";

const Util = require('gulp-util'),
    data = require('../convert/data.json'),
    config = require('../convert/config.json'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.seed = async(function (knex, Promise) {

    const modelOrdering = config['execution-ordering'];

    data.users = data.users.asEnumerable()
        .select(u=> ({id: u.id, name: u.name}))
        .toArray();

    data.journals.forEach(j => delete j.tagId);

    modelOrdering.forEach(modelName => {
        let tableName = modelName.pluralize();

        Util.log(Util.colors.gray(`Table : ${tableName} starting to insert`));

        let totalPages = (data[tableName].length / 100) + ((data[tableName].length % 100) ? 1 : 0);

        for (let i = 0; i < totalPages; i++) {
            Util.log(Util.colors.gray(`Page : ${i}`));
            let page = data[tableName].asEnumerable().skip(i * 100).take(100).toArray();
            await(knex(tableName).insert(page));
        }

        Util.log(Util.colors.gray(`Table : ${tableName} finished inserting`));
    });
    //let promises = modelOrdering.asEnumerable()
    //    .select(modelName => {
    //        let tableName = modelName.pluralize();
    //        return
    //    }).toArray();

});
