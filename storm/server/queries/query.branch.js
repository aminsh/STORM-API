const knexService = require('../services/knexService'),
    config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    image = require('../utilities/image');

module.exports = {
    getById: async.result(function (id) {
        var branch = await(knexService
            .select('id', 'name', 'logo')
            .from('branches')
            .where('id', id)
            .first());

        return {
            id: branch.id,
            name: branch.name,
            logo: branch.logo
        };
    }),
    getAll(){
        return knexService.select('id', 'name', 'logo', 'lucaConnectionId').from('branches');
    }
};
