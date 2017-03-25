"use strict";

const data = require('../models/data'),
    _util = require('../_util'),
    Bank = require('../models/bank');

class BankConvertor {

    execute() {
        data.banks = this.bankTitles.asEnumerable()
            .select(t => new Bank(t))
            .toArray();

            _util.idGenerator(data.banks);
    }

    get bankTitles() {
        return [
            'بانک توسعه صادرات ایران',
            'بانک صنعت و معدن',
            'بانک کشاورزی',
            'بانک مسکن',
            'بانک توسعه تعاون',
            'بانک ملّي ايران',
            'بانک سپه',
            'پست بانک ايران',
            'بانک اقتصاد نوين',
            'بانک پارسيان',
            'بانک پاسارگاد',
            'بانک کارآفرين',
            'بانک سامان',
            'بانک سينا',
            'بانک سرمايه',
            'بانک شهر',
            'بانک دي',
            'بانک صادرات',
            'بانک ملت',
            'بانک تجارت',
            'بانک رفاه',
            'بانک حکمت ايرانيان',
            'بانک گردشگري',
            'بانک ايران زمين',
            'بانک قوامين',
            'بانک انصار',
            'بانک خاور ميانه',
            'بانک آينده'
        ];
    }
}

module.exports = BankConvertor;