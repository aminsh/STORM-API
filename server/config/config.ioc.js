var fileSystemService = require('../services/fileSystemService'),
    path = require('path');

function register(ioc, req, res) {
    ioc.register('req', req);
    ioc.register('res', res);
    ioc.register('memoryService', require('../services/memoryService'));
    ioc.register('branchId', req.cookies['branch-id']);
    ioc.register('branchConfig', (branchId, memoryService) => {
        var config = memoryService.get('dbConfigs')
            .asEnumerable()
            .first(config => config.key == branchId);

        return config;
    });
    ioc.register('knex', require('../services/knex'));
    ioc.register('bookshelfService', require('../services/bookshelfService'));
    ioc.register('kendoQueryResolve', require('../services/kendoQueryResolve'));
    ioc.register('eventEmitter', require('../services/eventEmitter'));

    // config repository
    fileSystemService.getDirectoryFiles('/data')
        .forEach(file => {
            var fileName = file.replace(path.extname(file), ''),
                repo = require(`../data/${fileName}`),
                name = repo.name.camelize();

            ioc.register(name, repo);
        });


}

module.exports = register;
