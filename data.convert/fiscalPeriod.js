var async = require('asyncawait/async');
var await = require('asyncawait/await');

function fiscalPeriod(dbSource, dbTarget) {
    console.log('start converting fiscalPeriod ...');
    var years = await(new dbSource.Request().query('select * from Years'));

    console.log('date read from source');

    years.forEach((item) => {
        await(dbTarget('fiscalPeriods').insert({
            minDate: `13${item.year}/01/01`,
            maxDate: `13${item.year}/12/30`,
            isClosed: 'f',
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));
    });

    console.log('end converting fiscalPeriod ...');
}

module.exports = async(fiscalPeriod);
