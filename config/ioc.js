"use strict";

const Inverse = require('inverse'),
    container = new Inverse();

global.instanceOf = function () {
    return container.make.apply(container, arguments);
};

container.register('utility', {
    PersianDate: require('../shared/utilities/persianDate'),
    String: require('../shared/utilities/string'),
    Number: require('../shared/utilities/number'),
    Object: require('../shared/utilities/object'),
    Guid: require('../shared/utilities/guidService'),
    Image: require('../shared/utilities/image'),
    Common: require('../shared/utilities/common')
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

container.register('httpException', require('../shared/utilities/httpException'));
container.register('domainException', require('../shared/utilities/domain').DomainException);
container.register('domainResponse', require('../shared/utilities/domain').DomainResponse);

container.singleton('TokenGenerator', function () {
    let TokenGenerator = require('../shared/services/token.generator');
    return new TokenGenerator();
});

container.bind('PaymentService', function (key) {
    if (key === 'payping') {
        const PaypingService = require('../integration/payping/service');
        return new PaypingService();
    }
});

container.singleton('webhook', function () {
    let Webhook = require('../shared/services/webhook');
    return new Webhook();
});

container.singleton('user.repository', function () {
    let UserRepository = require('../storm/server/features/user/user.repository');
    return new UserRepository();
});

container.singleton('branchService', function () {
    let BranchService = require('../api/branchService');
    return new BranchService();
});

container.singleton('persistedConfig.repository', function () {
    let PersistedConfigRepository = require('../storm/server/features/persistedConfig/persistedConfig.repository');
    return new PersistedConfigRepository();
});

container.singleton('branchThirdParty.repository', function () {
    let BranchThirdPartyRepository = require('../storm/server/features/thirdParty/branchThirdPary.repository');
    return new BranchThirdPartyRepository();
});

container.singleton('branchThirdParty.query', function () {
    let BranchThirdPartyQuery = require('../storm/server/features/thirdParty/branchThirdParty.query');
    return new BranchThirdPartyQuery();
});







