var async = require('asyncawait/async');
var await = require('asyncawait/await');

function dimension(dbSource, dbTarget) {
    console.log('start converting dimension ...');
    var categories = await(dbTarget.select().from('dimensionCategories'));

    var sourceTables = [
        {name: 'CostCenter', code: 'Code4', title: 'Title'},
        {name: 'tblCode5', code: 'ID', title: 'Des'},
        {name: 'tblCode6', code: 'ID', title: 'Des'}
    ];

    categories.forEach((cat, i)=> {
        var sourceTable = sourceTables[i];

        var items = await(new dbSource.Request().query(`select * from ${sourceTable.name}`));

        console.log(`${sourceTable.name} read from source`);

        items.forEach(item=> {
            await(dbTarget('dimensions').insert({
                code: item[sourceTable.code],
                title: item[sourceTable.title],
                dimensionCategoryId: cat.id,
                isActive: true,
                createdAt: dbTarget.raw('now()'),
                updatedAt: dbTarget.raw('now()')
            }));
        });

    });

    console.log('end converting dimension ...');
}


module.exports = async(dimension);

