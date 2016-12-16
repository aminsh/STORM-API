var knexService = require('../services/knexService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports.getById = async.result(function (id) {
    var branch = await(knexService.select('id', 'name', 'logo').from('branches').where('id', id))[0];

    return {
        id: branch.id,
        name: branch.name,
        logo: '/uploads/;/{0}'.format(branch.logo)
    };
});
