"use strict";

module.exports = {
    service: {
        Crypto: require('../../../shared/services/cryptoService'),
        EventEmitter: require('../../../shared/services/eventEmitter'),
        Memory: require('../../../shared/services/memoryService'),
        PersianDate: require('../../../shared/services/persianDateService')
    },
    utility: {
        Guid: require('../../../shared/utilities/guidService'),
        Image: require('../../../shared/utilities/image'),
        Number: require('../../../shared/utilities/number'),
        String: require('../../../shared/utilities/string'),
        Object: require('../../../shared/utilities/object')
    }
};