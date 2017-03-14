"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalTag = require('../models/journalTag');


class JournalTagConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        data.journalTags = data.journals.asEnumerable()
            .where(j => j.tagId && this.getTagId(j.tagId))
            .select(j => new JournalTag({ journalId: j.id, tagId: this.getTagId(j.tagId) }))
            .toArray();

        _util.idGenerator(data.journalTags);
    }

    getTagId(id){
        let tag = data.tags.asEnumerable().firstOrDefault(t => t.id == id);
        return (!tag) ? null : tag.id;
    }
}

module.exports = JournalTagConvertor;

