var async = require('asyncawait/async');
var await = require('asyncawait/await');

function dimensionCategory(dbSource, dbTarget) {
    console.log('start converting dimensionCategory ...');


    console.log('date read from source');

    var cats = [
        'تفصیل 2',
        'تفصیل 3',
        'تفصیل 4'
    ];
    cats.forEach((item) => {
        await(dbTarget('dimensionCategories').insert({
            title: item,
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));
    });

    console.log('end converting dimensionCategory ...');
}


module.exports = async(dimensionCategory);

