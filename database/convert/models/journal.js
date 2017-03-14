"use strict";

const Base = require('./base'),
    _util = require('../_util');

class Journal extends Base {
    constructor(model, userId, periodId, isInComplete) {

        if (!(userId && periodId && isInComplete))
            new Error('PeriodId or UserId or IsInComplete has no value');
        super();

        this.id = model.ID;
        this.description = model.description;
        this.number = model.doc_no;
        this.date = _util.date(model.doc_date);
        this.temporaryNumber = model.local_no;
        this.temporaryDate = _util.date(model.local_date);
        this.journalStatus = this.getStatus(model);
        this.journalType = this.getType(model.Currency);
        this.isInComplete = isInComplete;
        this.createdById = userId;
        this.periodId = periodId;
        
        this.tagId = model.KindDocumentID;
    }

    getStatus(item) {
        if (item.doc_no && item.Fixed)
            return 'Fixed';

        if (item.doc_no && !item.Fixed)
            return 'BookKeeped';

        return 'Temporary';
    }

    getType(value) {
        if (!value) return null;
        if (value == 0) return null;

        var types = {
            1: 'Special',
            2: 'FixedAsset',
            3: 'Payroll',
            4: 'Opening',
            5: 'Closing'
        };

        return types[value];
    }
}

module.exports = Journal;