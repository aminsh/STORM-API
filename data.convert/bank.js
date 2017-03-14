var async = require('asyncawait/async');
var await = require('asyncawait/await');

function bank(dbSource, dbTarget) {
    console.log('start converting bank ...');

    var banks = [
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک توسعه صادرات ایران'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک صنعت و معدن'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک کشاورزی'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک مسکن'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک توسعه تعاون'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک ملّي ايران'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک سپه'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'پست بانک ايران'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک اقتصاد نوين'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک پارسيان'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک پاسارگاد'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک کارآفرين'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک سامان'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک سينا'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک سرمايه'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک شهر'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک دي'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک صادرات'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک ملت'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک تجارت'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک رفاه'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک حکمت ايرانيان'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک گردشگري'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک ايران زمين'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک قوامين'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک انصار'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک خاور ميانه'},
        {createdAt: dbTarget.raw('now()'), updatedAt: dbTarget.raw('now()'), title: 'بانک آينده'}
    ];

    await(dbTarget('banks').insert(banks));

    console.log('end converting bank ...');
}

module.exports = async(bank);