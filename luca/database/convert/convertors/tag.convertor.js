"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Tag = require('../models/tag');

class TagConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let kindDocuments = await(this.sql.query('select * from KindDocument'));

        data.tags = kindDocuments.asEnumerable()
            .select(kd => new Tag(kd))
            .toArray();
    }
}

module.exports = TagConvertor;