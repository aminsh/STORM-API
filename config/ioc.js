"use strict";

const Inverse = require('inverse'),
    container = new Inverse();

global.instanceOf = name => container.make(name);

container.register('utility', {
    PersianDate: require('../shared/utilities/persianDate'),
    String: require('../shared/utilities/string'),
    Number: require('../shared/utilities/number'),
    Object: require('../shared/utilities/object'),
    Guid: require('../shared/utilities/guidService'),
    Image: require('../shared/utilities/image')
});
container.register('config', require('./enviroment'));
//container.register('io', require('../storm/server/bootstrap').io);

container.register('EventEmitter', require('../shared/services/eventEmitter'));
container.register('Email', require('../shared/services/emailService'));
container.register('knex', require('../shared/services/knex'));
container.register('kendoQueryResolve', require('../shared/services/kendoQueryResolve'));
container.register('htmlRender', require('../shared/services/ejsRenderService'));
container.register('Crypto', require('../shared/services/cryptoService'));
container.register('Enums', require('../shared/enums'));

container.singleton('Authentication', function () {
    let Authentication = require('../shared/services/service.authentication');
    return new Authentication();
});


container.singleton('user.repository', function () {
    let UserRepository = require('../storm/server/features/user/user.repository');
    return new UserRepository();
});

container.singleton('branch.repository', function () {
    let BranchRepository = require('../storm/server/features/branch/branch.repository');
    return new BranchRepository();
});

container.singleton('persistedConfig.repository', function () {
    let PersistedConfigRepository = require('../storm/server/features/persistedConfig/persistedConfig.repository');
    return new PersistedConfigRepository();
});

container.singleton('branchThirdParty.repository', function () {
    let BranchThirdPartyRepository = require('../storm/server/features/thirdParty/branchThirdPary.repository');
    return new BranchThirdPartyRepository();
});






