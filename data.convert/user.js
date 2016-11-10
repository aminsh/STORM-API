var async = require('asyncawait/async');
var await = require('asyncawait/await');
var md5 = require('md5');

function fiscalPeriod(dbSource, dbTarget) {
    console.log('start converting users ...');
    var users = await(new dbSource.Request().query('select * from tblSysUser'));

    console.log('date read from source');

    await(dbTarget('users').insert({
        name: 'کاربر عمومی',
        username: 'Public',
        password: md5('123456'),
        createdAt: dbTarget.raw('now()'),
        updatedAt: dbTarget.raw('now()')
    }));

    users.forEach((item) => {
        await(dbTarget('users').insert({
            name: item.USname,
            username: item.USid,
            password: md5(item.USpwd),
            createdAt: dbTarget.raw('now()'),
            updatedAt: dbTarget.raw('now()')
        }));
    });

    console.log('end converting users ...');
}

module.exports = async(fiscalPeriod);