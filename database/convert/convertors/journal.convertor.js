"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Journal = require('../models/journal'),
    Util = require('gulp-util');

class JournalConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let topics = await(this.sql.query('select * from topics'));

        data.journals = topics.asEnumerable()
            .select(t => new Journal(
                t,
                this.getUserId(t.LastUser),
                this.getPeriodId(t.Year),
                this.isCompleteJournal(t.ID),
                this.getTagId(t.KindDocumentID)
            ))
            .toArray();
    }

    getUserId(username) {
        let userEnumerable = data.users.asEnumerable();

        return (userEnumerable.any(u => u.oldUsername == username)
            ? data.users.asEnumerable().first(u => u.oldUsername == username)
            : data.users[0]).id;
    }

    getPeriodId(year) {
        return data.fiscalPeriods.asEnumerable()
            .first(p => p.minDate.includes(`13${year}`)).id;
    }

    isCompleteJournal(id) {
        var count = await(this.sql
            .query(`select count(*) as countRows from document where id = ${id}`))[0]
            .countRows;

        if (count == 0) return true;

        var remainder = await(this.sql
            .query(`select sum(bed) - sum(bes) as [remainder] from document where id = ${id}`))[0]
            .remainder;

        return remainder != 0;
    }

    getTagId(KindId) {
        if ([0, 1].includes(KindId)) return null;

        let tag = data.tags.asEnumerable().singleOrDefault(t => t.referenceId == KindId);

        return (tag) ? tag.id : null;
    }
}

module.exports = JournalConvertor;

