var Enum = require('../../../shared/utilities/Enum');

var enums = {};

enums.UserState = function () {
    return new Enum([
        { key: 'pending', display: 'انتظار' },
        { key: 'active', display: 'فعال' }
    ]);
};

enums.BranchStatus = function () {
    return new Enum([
        { key: 'pending', display: 'انتظار' },
        { key: 'active', display: 'فعال' }
    ]);
};

enums.UserInBranchState = function () {
    return new Enum([
        { key: 'new', display: 'جدید' },
        { key: 'active', display: 'فعال' },
        { key: 'inactive', display: 'غیر فعال' }
    ]);
};

enums.App = function () {
    return new Enum([
        { key: 'accounting', display: 'حسابداری' }
    ]);
};

module.exports = enums;