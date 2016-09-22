(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a)return a(o, !0);
                if (i)return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {exports: {}};
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)s(r[o]);
    return s
})({
    1: [function (require, module, exports) {
        'use strict';

        var _acc = require('./acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        require('./config/route.config');

        require('./config/menu.config.js');

        require('./config/translate.config');

        require('./config/gridFilterCellTypeConfig');

        require('./controllers/shellController');

        require('./controllers/homeController');

        require('./controllers/generalLedgerAccountsController');

        require('./controllers/subsidiaryLedgerAccountsController');

        require('./controllers/subsidiaryLedgerAccountCreateController');

        require('./controllers/subsidiaryLedgerAccountUpdateController');

        require('./controllers/detailAccountsController');

        require('./controllers/detailAccountCreateController');

        require('./controllers/detailAccountUpdateController');

        require('./controllers/dimensionsController');

        require('./controllers/journalsController');

        require('./controllers/journalUpdateController');

        require('./controllers/journalLineCreateOrUpdateController');

        require('./controllers/journalLineUpdateController');

        require('./controllers/chequeCategoriesController');

        require('./controllers/banksController');

        require('./apis/generalLedgerAccountApi');

        require('./apis/subsidiaryLedgerAccountApi');

        require('./apis/detailAccountApi');

        require('./apis/dimensionCategoryApi');

        require('./apis/dimensionApi');

        require('./apis/journalApi');

        require('./apis/journalLineApi');

        require('./apis/chequeCategoryApi');

        require('./apis/bankApi');

        require('./apis/chequeApi');

        require('./modals/generalLedgerAccountCreate');

        require('./modals/generalLedgerAccountUpdate');

        require('./modals/dimensionCreate');

        require('./modals/dimensionUpdate');

        require('./modals/journalCreate');

        require('./modals/journalLineCreateOrUpdate');

        require('./modals/journalBookkeeping');

        require('./modals/journalAttachImage');

        require('./modals/chequeCategroyCreate');

        require('./modals/chequeCategroyUpdate');

        require('./localData/constants');

        require('./directives/alert');

        require('./directives/subContent');

        require('./directives/blockUi');

        require('./directives/customValidator');

        require('./directives/validationSummary');

        require('./directives/focusMe');

        require('./directives/uploader');

        require('./filters/amount');

        require('./services/formService');

        require('./services/translateStorageService');

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

//service


//directives
        _acc2.default.init();

//filter


// load modals


// load apis


//load controllers


// load config

    }, {
        "./acc.module": 2,
        "./apis/bankApi": 3,
        "./apis/chequeApi": 4,
        "./apis/chequeCategoryApi": 5,
        "./apis/detailAccountApi": 6,
        "./apis/dimensionApi": 7,
        "./apis/dimensionCategoryApi": 8,
        "./apis/generalLedgerAccountApi": 9,
        "./apis/journalApi": 10,
        "./apis/journalLineApi": 11,
        "./apis/subsidiaryLedgerAccountApi": 12,
        "./config/gridFilterCellTypeConfig": 13,
        "./config/menu.config.js": 14,
        "./config/route.config": 15,
        "./config/translate.config": 16,
        "./controllers/banksController": 17,
        "./controllers/chequeCategoriesController": 18,
        "./controllers/detailAccountCreateController": 19,
        "./controllers/detailAccountUpdateController": 20,
        "./controllers/detailAccountsController": 21,
        "./controllers/dimensionsController": 22,
        "./controllers/generalLedgerAccountsController": 23,
        "./controllers/homeController": 24,
        "./controllers/journalLineCreateOrUpdateController": 25,
        "./controllers/journalLineUpdateController": 26,
        "./controllers/journalUpdateController": 27,
        "./controllers/journalsController": 28,
        "./controllers/shellController": 29,
        "./controllers/subsidiaryLedgerAccountCreateController": 30,
        "./controllers/subsidiaryLedgerAccountUpdateController": 31,
        "./controllers/subsidiaryLedgerAccountsController": 32,
        "./directives/alert": 33,
        "./directives/blockUi": 34,
        "./directives/customValidator": 35,
        "./directives/focusMe": 36,
        "./directives/subContent": 37,
        "./directives/uploader": 38,
        "./directives/validationSummary": 39,
        "./filters/amount": 40,
        "./localData/constants": 42,
        "./modals/chequeCategroyCreate": 46,
        "./modals/chequeCategroyUpdate": 47,
        "./modals/dimensionCreate": 48,
        "./modals/dimensionUpdate": 49,
        "./modals/generalLedgerAccountCreate": 50,
        "./modals/generalLedgerAccountUpdate": 51,
        "./modals/journalAttachImage": 52,
        "./modals/journalBookkeeping": 53,
        "./modals/journalCreate": 54,
        "./modals/journalLineCreateOrUpdate": 55,
        "./services/formService": 56,
        "./services/translateStorageService": 57
    }],
    2: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _angular = require('angular');

        var _angular2 = _interopRequireDefault(_angular);

        require('angular-animate');

        require('angular-bootstrap');

        require('angular-route');

        require('angular-sanitize');

        require('angular-translate');

        require('angular-resource');

        require('angular-messages');

        require('kendo');

        require('kendo.messages');

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        var accModule = _angular2.default.module('acc.module', ['core.module', 'ngAnimate', 'ngRoute', 'ngResource', 'ngSanitize', 'ui.bootstrap', 'pascalprecht.translate', 'kendo.directives', 'ngMessages']);

        accModule.init = function () {
            _angular2.default.element(document).ready(function () {
                _angular2.default.bootstrap(document, ['acc.module']);
            });
        };

        exports.default = accModule;

    }, {
        "angular": "angular",
        "angular-animate": "angular-animate",
        "angular-bootstrap": "angular-bootstrap",
        "angular-messages": "angular-messages",
        "angular-resource": "angular-resource",
        "angular-route": "angular-route",
        "angular-sanitize": "angular-sanitize",
        "angular-translate": "angular-translate",
        "kendo": "kendo",
        "kendo.messages": "kendo.messages"
    }],
    3: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function bankApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                getById: function getById(id) {
                    return apiPromise.get('{0}/banks/{1}'.format(urlPrefix, id));
                },
                create: function create(data) {
                    return apiPromise.post('{0}/banks'.format(urlPrefix), data);
                },
                update: function update(id, data) {
                    return apiPromise.put('{0}/banks/{1}'.format(urlPrefix, id), data);
                },
                remove: function remove(id) {
                    return apiPromise.delete('{0}/banks/{1}'.format(urlPrefix, id));
        }
            };
        }

        _acc2.default.factory('bankApi', bankApi);

    }, {"../acc.module": 2}],
    4: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function chequeApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                getById: function getById(id) {
                    return apiPromise.get('{0}/cheques/{1}'.format(urlPrefix, id));
        }
            };
        }

        _acc2.default.factory('chequeApi', chequeApi);

    }, {"../acc.module": 2}],
    5: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function chequeCategoryApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                getById: function getById(id) {
                    return apiPromise.get('{0}/cheque-categories/{1}'.format(urlPrefix, id));
                },
                create: function create(data) {
                    return apiPromise.post('{0}/cheque-categories'.format(urlPrefix), data);
                },
                update: function update(id, data) {
                    return apiPromise.put('{0}/cheque-categories/{1}'.format(urlPrefix, id), data);
                },
                remove: function remove(id) {
                    return apiPromise.delete('{0}/cheque-categories/{1}'.format(urlPrefix, id));
        }
            };
        }

        _acc2.default.factory('chequeCategoryApi', chequeCategoryApi);

    }, {"../acc.module": 2}],
    6: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function detailAccountApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                url: {
                    getAll: '{0}/detail-accounts'.format(urlPrefix),
                    getAllActive: '{0}/detail-accounts/active'.format(urlPrefix)
                },
                getById: function getById(id) {
                    return apiPromise.get('{0}/detail-accounts/{1}'.format(urlPrefix, id));
                },
                create: function create(data) {
                    return apiPromise.post('{0}/detail-accounts'.format(urlPrefix), data);
                },
                update: function update(id, data) {
                    return apiPromise.put('{0}/detail-accounts/{1}'.format(urlPrefix, id), data);
                },
                remove: function remove(id) {
                    return apiPromise.delete('{0}/detail-accounts/{1}'.format(urlPrefix, id));
                },
                activate: function activate(id) {
                    return apiPromise.put('{0}/detail-accounts/{1}/activate'.format(urlPrefix, id));
                },
                deactivate: function deactivate(id) {
                    return apiPromise.put('{0}/detail-accounts/{1}/deactivate'.format(urlPrefix, id));
        }
            };
        }

        _acc2.default.factory('detailAccountApi', detailAccountApi);

    }, {"../acc.module": 2}],
    7: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function dimensionApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                url: {
                    getAll: function getAll(parentId) {
                        return '{0}/dimensions/category/{1}'.format(urlPrefix, parentId);
                    }
                },
                getAll: function getAll() {
                    return apiPromise.get('{0}/dimensions'.format(urlPrefix));
                },
                getById: function getById(id) {
                    return apiPromise.get('{0}/dimensions/{1}'.format(urlPrefix, id));
                },
                create: function create(categoryId, data) {
                    return apiPromise.post('{0}/dimensions/category/{1}'.format(urlPrefix, categoryId), data);
                },
                update: function update(id, data) {
                    return apiPromise.put('{0}/dimensions/{1}'.format(urlPrefix, id), data);
                },
                remove: function remove(id) {
                    return apiPromise.delete('{0}/dimensions/{1}'.format(urlPrefix, id));
                },
                activate: function activate(id) {
                    return apiPromise.put('{0}/dimensions/{1}/activate'.format(urlPrefix, id));
                },
                deactivate: function deactivate(id) {
                    return apiPromise.put('{0}/dimensions/{1}/deactivate'.format(urlPrefix, id));
        }
            };
        }

        _acc2.default.factory('dimensionApi', dimensionApi);

    }, {"../acc.module": 2}],
    8: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function dimensionCategoryApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                url: {
                    getAll: '{0}/dimension-categories'.format(urlPrefix)
                },
                getAll: function getAll() {
                    return apiPromise.get('{0}/dimension-categories'.format(urlPrefix));
                },
                getById: function getById(id) {
                    return apiPromise.get('{0}/dimension-categories/{1}'.format(urlPrefix, id));
                },
                create: function create(data) {
                    return apiPromise.post('{0}/dimension-categories'.format(urlPrefix), data);
                },
                update: function update(id, data) {
                    return apiPromise.put('{0}/dimension-categories/{1}'.format(urlPrefix, id), data);
                },
                remove: function remove(id) {
                    return apiPromise.delete('{0}/dimension-categories/{1}'.format(urlPrefix, id));
                },
                activate: function activate(id) {
                    return apiPromise.put('{0}/dimension-categories/{1}/activate'.format(urlPrefix, id));
                },
                deactivate: function deactivate(id) {
                    return apiPromise.put('{0}/dimension-categories/{1}/deactivate'.format(urlPrefix, id));
        }
            };
        }

        _acc2.default.factory('dimensionCategoryApi', dimensionCategoryApi);

    }, {"../acc.module": 2}],
    9: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function generalLedgerAccountApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                url: {
                    getAll: '{0}/general-ledger-accounts'.format(urlPrefix),
                    getAllActive: '{0}/general-ledger-accounts/active'.format(urlPrefix)
                },
                getById: function getById(id) {
                    return apiPromise.get('{0}/general-ledger-accounts/{1}'.format(urlPrefix, id));
                },
                create: function create(data) {
                    return apiPromise.post('{0}/general-ledger-accounts'.format(urlPrefix), data);
                },
                update: function update(id, data) {
                    return apiPromise.put('{0}/general-ledger-accounts/{1}'.format(urlPrefix, id), data);
                },
                remove: function remove(id) {
                    return apiPromise.delete('{0}/general-ledger-accounts/{1}'.format(urlPrefix, id));
                },
                activate: function activate(id) {
                    return apiPromise.put('{0}/general-ledger-accounts/{1}/activate'.format(urlPrefix, id));
                },
                deactivate: function deactivate(id) {
                    return apiPromise.put('{0}/general-ledger-accounts/{1}/deactivate'.format(urlPrefix, id));
        }
            };
        }

        _acc2.default.factory('generalLedgerAccountApi', generalLedgerAccountApi);

    }, {"../acc.module": 2}],
    10: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                url: {
                    getAll: '{0}/journals'.format(urlPrefix)
                },
                getById: function getById(id) {
                    return apiPromise.get('{0}/journals/{1}'.format(urlPrefix, id));
                },
                create: function create(data) {
                    return apiPromise.post('{0}/journals'.format(urlPrefix), data);
                },
                update: function update(id, data) {
                    return apiPromise.put('{0}/journals/{1}'.format(urlPrefix, id), data);
                },
                remove: function remove(id) {
                    return apiPromise.delete('{0}/journals/{1}'.format(urlPrefix, id));
                },
                bookkeeping: function bookkeeping(id, data) {
                    return apiPromise.put('{0}/journals/{1}/bookkeeping'.format(urlPrefix, id), data);
                },
                attachImage: function attachImage(id, data) {
                    return apiPromise.put('{0}/journals/{1}/attach-image'.format(urlPrefix, id), data);
        }
            };
        }

        _acc2.default.factory('journalApi', journalApi);

    }, {"../acc.module": 2}],
    11: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalLineApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                url: {
                    getAll: function getAll(journalId) {
                        return '{0}/journal-lines/journal/{1}'.format(urlPrefix, journalId);
                    }
                },
                getById: function getById(id) {
                    return apiPromise.get('{0}/journal-lines/{1}'.format(urlPrefix, id));
                },
                create: function create(journalId, data) {
                    return apiPromise.post('{0}/journal-lines/journal/{1}'.format(urlPrefix, journalId), data);
                },
                update: function update(id, data) {
                    return apiPromise.put('{0}/journal-lines/{1}'.format(urlPrefix, id), data);
                },
                remove: function remove(id) {
                    return apiPromise.delete('{0}/journal-lines/{1}'.format(urlPrefix, id));
        }
            };
        }

        _acc2.default.factory('journalLineApi', journalLineApi);

    }, {"../acc.module": 2}],
    12: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function subsidiaryLedgerAccountApi(apiPromise) {
            var urlPrefix = '/api';

            return {
                url: {
                    getAll: function getAll(parentId) {
                        return '{0}/subsidiary-ledger-accounts/general-ledger-account/{1}'.format(urlPrefix, parentId);
                    },
                    getAllActive: function getAllActive(parentId) {
                        return '{0}/subsidiary-ledger-accounts/general-ledger-account/{1}/active'.format(urlPrefix, parentId);
                    }
                },
                getById: function getById(id) {
                    return apiPromise.get('{0}/subsidiary-ledger-accounts/{1}/'.format(urlPrefix, id));
                },
                create: function create(parentId, data) {
                    return apiPromise.post('{0}/subsidiary-ledger-accounts/general-ledger-account/{1}'.format(urlPrefix, parentId), data);
                },

                update: function update(id, data) {
                    return apiPromise.put('{0}/subsidiary-ledger-accounts/{1}'.format(urlPrefix, id), data);
                },

                remove: function remove(id) {
                    return apiPromise.delete('{0}/subsidiary-ledger-accounts/{1}'.format(urlPrefix, id));
                },

                activate: function activate(id) {
                    return apiPromise.put('{0}/subsidiary-ledger-accounts/{1}/activate'.format(urlPrefix, id));
                },

                deactivate: function deactivate(id) {
                    return apiPromise.put('{0}/subsidiary-ledger-accounts/{1}/deactivate'.format(urlPrefix, id));
                }
            };
        }

        _acc2.default.factory('subsidiaryLedgerAccountApi', subsidiaryLedgerAccountApi);

    }, {"../acc.module": 2}],
    13: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        var _constants = require('../localData/constants');

        var _constants2 = _interopRequireDefault(_constants);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        _acc2.default.config(function (gridFilterCellTypeProvider) {

            var postingType = {
                cell: gridFilterCellTypeProvider.control.dropdown({
                    text: 'display',
                    value: 'key',
                    data: _constants2.default.enums.AccountPostingType()
                }),
                modelType: 'string'
            };
            var balanceType = {
                cell: gridFilterCellTypeProvider.control.dropdown({
                    text: 'display',
                    value: 'key',
                    data: _constants2.default.enums.AccountBalanceType()
                }),
                modelType: 'string'
            };

            var activeType = {
                cell: gridFilterCellTypeProvider.control.dropdown({
                    text: 'display',
                    value: 'key',
                    data: _constants2.default.enums.Active()
                }),
                modelType: 'boolean'
            };

            var journalType = {
                cell: gridFilterCellTypeProvider.control.dropdown({
                    text: 'display',
                    value: 'key',
                    data: _constants2.default.enums.JournalType()
                }),
                modelType: 'number'
            };

            var journalStatus = {
                cell: gridFilterCellTypeProvider.control.dropdown({
                    text: 'display',
                    value: 'key',
                    data: _constants2.default.enums.JournalStatus()
                }),
                modelType: 'number'
            };

            var chequeCategoryStatus = {
                cell: gridFilterCellTypeProvider.control.dropdown({
                    text: 'display',
                    value: 'key',
                    data: _constants2.default.enums.ChequeCategoryStatus()
                }),
                modelType: 'number'
            };

            var generalLedgerAccount = {
                cell: gridFilterCellTypeProvider.control.combo({
                    text: 'title',
                    value: 'id',
                    url: _constants2.default.urls.generalLedgerAccount.all()
                }),
                modelType: 'string'
            };

            var subsidiaryLedgerAccount = {
                cell: gridFilterCellTypeProvider.control.combo({
                    text: 'title',
                    value: 'id',
                    url: _constants2.default.urls.subsidiaryLedgerAccount.all()
                }),
                modelType: 'string'
            };

            var detailAccount = {
                cell: gridFilterCellTypeProvider.control.combo({
                    text: 'display',
                    value: 'id',
                    url: _constants2.default.urls.detailAccount.all()
                }),
                modelType: 'string'
            };

            var bank = {
                cell: gridFilterCellTypeProvider.control.combo({
                    text: 'title',
                    value: 'id',
                    url: _constants2.default.urls.bank.all()
                }),
                modelType: 'number'

            };

            gridFilterCellTypeProvider.set({
                postingType: postingType,
                balanceType: balanceType,
                activeType: activeType,
                journalType: journalType,
                journalStatus: journalStatus,
                chequeCategoryStatus: chequeCategoryStatus,
                generalLedgerAccount: generalLedgerAccount,
                subsidiaryLedgerAccount: subsidiaryLedgerAccount,
                detailAccount: detailAccount,
                bank: bank
            });
        });

    }, {"../acc.module": 2, "../localData/constants": 42}],
    14: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        _acc2.default.config(function (menuItemsProvider) {
            "use strict";

            menuItemsProvider.add({
                title: 'سرفصل حسابها و سطوح',
                url: '',
                icon: '',
                children: [{
                    title: 'حسابهای کل و معین',
                    url: '#/general-ledger-accounts'
                }, {
                    title: 'حساب تفصیل',
                    url: '#/detail-accounts'
                }, {
                    title: 'سطوح',
                    url: '#/dimensions'
                }]
            }).add({
                title: 'سند حسابداری',
                url: '',
                icon: '',
                children: [{
                    title: 'لیست اسناد حسابداری',
                    url: '#/journals',
                    icon: ''
                }, {
                    title: 'سند حسابداری جدید',
                    url: '#/journal-new',
                    icon: ''
                }]
            }).add({
                title: 'خزانه داری',
                url: '',
                icon: '',
                children: [{
                    title: 'دسته چک ها',
                    url: '#/cheque-categories',
                    icon: ''
                }, {
                    title: 'بانک ها',
                    url: '#/banks',
                    icon: ''
                }]
            });
        });

    }, {"../acc.module": 2}],
    15: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        _acc2.default.config(function ($routeProvider) {
            $routeProvider.when('/', {
                controller: 'homeController',
                templateUrl: 'partials/views/home.html'
            }).when('/general-ledger-accounts', {
                controller: 'generalLedgerAccountsController',
                templateUrl: 'partials/views/generalLedgerAccounts.html'
            }).when('/subsidiary-ledger-accounts/:generalLedgerAccountId', {
                controller: 'subsidiaryLedgerAccountsController',
                templateUrl: 'partials/views/subsidiaryLedgerAccounts.html'
            }).when('/subsidiary-ledger-account/:generalLedgerAccountId/create', {
                controller: 'subsidiaryLedgerAccountCreateController',
                templateUrl: 'partials/views/subsidiaryLedgerAccountCreate.html'
            }).when('/subsidiary-ledger-account/:id/edit', {
                controller: 'subsidiaryLedgerAccountUpdateController',
                templateUrl: 'partials/views/subsidiaryLedgerAccountUpdate.html'
            }).when('/detail-accounts', {
                controller: 'detailAccountsController',
                templateUrl: 'partials/views/detailAccounts.html'
            }).when('/detail-account/create', {
                controller: 'detailAccountCreateController',
                templateUrl: 'partials/views/detailAccountCreate.html'
            }).when('/detail-account/:id/edit', {
                controller: 'detailAccountUpdateController',
                templateUrl: 'partials/views/detailAccountUpdate.html'
            }).when('/dimensions', {
                controller: 'dimensionsController',
                templateUrl: 'partials/views/dimensions.html'
            }).when('/journals', {
                controller: 'journalsController',
                templateUrl: 'partials/views/journals.html'
            }).when('/journal/:id/edit', {
                controller: 'journalUpdateController',
                templateUrl: 'partials/views/journalUpdate.html'
            }).when('/journal-line/:journalId/create', {
                controller: 'journalLineCreateController',
                templateUrl: 'partials/views/journalLineCreateOrUpdate.html'
            }).when('/journal-line/:id/edit', {
                controller: 'journalLineUpdateController',
                templateUrl: 'partials/views/journalLineCreateOrUpdate.html'
            }).when('/not-found', {
                templateUrl: 'partials/views/notFound.html'
            }).when('/cheque-categories', {
                controller: 'chequeCategoriesController',
                templateUrl: 'partials/views/chequeCategories.html'
            }).when('/banks', {
                controller: 'banksController',
                templateUrl: 'partials/views/banks.html'
            }).otherwise('/not-found');
        });

        _acc2.default.run(function ($route) {
            return $route.reload();
        });

    }, {"../acc.module": 2}],
    16: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        require('angular-translate-loader-url');

        var _config = require('../localData/config');

        var _config2 = _interopRequireDefault(_config);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        _acc2.default.config(function ($translateProvider) {
            if (_config2.default.isClientTest()) {
                $translateProvider.useUrlLoader('client/translate.json');
            } else {
                var translate = JSON.parse(localStorage.getItem('translate'));

                $translateProvider.translations('fa_IR', translate);
                $translateProvider.useStorage('translateStorageService');
            }

            $translateProvider.preferredLanguage('fa_IR');
            $translateProvider.useSanitizeValueStrategy('escapeParameters');
        });

    }, {"../acc.module": 2, "../localData/config": 41, "angular-translate-loader-url": "angular-translate-loader-url"}],
    17: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function banksController($scope, logger, confirm, bankApi, constants, translate) {
            $scope.gridDateSource = {
                transport: {
                    read: {
                        url: constants.urls.bank.all(),
                        dataType: "json",
                        contentType: 'application/json; charset=utf-8',
                        type: 'GET'
                    },
                    update: {
                        url: function url(model) {
                            return '/api/banks/{0}'.format(model.id);
                        },
                        dataType: 'json',
                        type: "PUT"
                    },
                    create: {
                        url: '/api/banks',
                        dataType: 'json',
                        type: 'POST'
                    },
                    destroy: {
                        url: function url(model) {
                            return '/api/banks/{0}'.format(model.id);
                        },
                        dataType: 'json',
                        type: "DELETE"
                    }
                },
                pageSize: 20,
                schema: {
                    data: 'data',
                    total: 'total',
                    model: {
                        id: 'id',
                        fields: {
                            title: {validation: {required: true}}
                        }

                    }
                },
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            };

            var gridOption = $scope.gridOption = {
                columns: [{name: 'title', title: translate('Title'), type: 'string'}],
                commands: ['edit', {
                    title: translate('Remove'),
                    action: function action(current) {
                        confirm(translate('Remove Bank'), translate('Are you sure ?')).then(function () {
                            gridOption.grid.dataSource.remove(current);
                            gridOption.grid.dataSource.sync().then(function () {
                                logger.success();
                                $scope.$apply();
                            });
                        });
                    }
                }],
                editable: "inline"
            };

            $scope.create = function () {
                gridOption.grid.addRow();
            };
        }

        _acc2.default.controller('banksController', banksController);

    }, {"../acc.module": 2}],
    18: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function chequeCategoriesController($scope, logger, chequeCategoryApi, confirm, constants, translate, $timeout, chequeCategoryCreateModalService, chequeCategoryUpdateModalService) {
            $scope.gridOption = {
                columns: [{
                    name: 'bankId',
                    title: translate('Bank'),
                    width: '10%',
                    type: 'bank',
                    template: '${data.bank}'
                }, {
                    name: 'totalPages',
                    title: translate('Total pages'),
                    type: 'number',
                    width: '10%'
                }, {
                    name: 'firstPageNumber',
                    title: translate('First page number'),
                    type: 'number',
                    width: '10%'
                }, {name: 'lastPageNumber', title: translate('Last page number'), type: 'number', width: '10%'}, {
                    name: 'detailAccountId',
                    title: translate('Detail account'),
                    type: 'detailAccount',
                    template: '${data.detailAccount}'
                }, {
                    name: 'status',
                    title: translate('Status'),
                    type: 'chequeCategoryStatus',
                    template: '${data.statusDisplay}',
                    width: '10%'
                }],
                commands: [{
                    title: translate('Edit'),
                    action: function action(current) {
                        chequeCategoryUpdateModalService.show({id: current.id}).then(function () {
                    logger.success();
                    $scope.gridOption.refresh();
                });
                    }
                }, {
                    title: translate('Remove'),
                    action: function action(current) {
                        confirm(translate('Remove Cheque category'), translate('Are you sure ?')).then(function () {
                            chequeCategoryApi.remove(current.id).then(function () {
                                logger.success();
                                $scope.gridOption.refresh();
                            }).catch(function (errors) {
                                return $scope.errors = errors;
                            }).finally(function () {
                                return $scope.isSaving = false;
                            });
                        });
                    }
                }],
                readUrl: constants.urls.chequeCategory.all(),
                current: null,
                selectable: true
            };

            $scope.chequeGridOption = {
                columns: [{name: 'number', title: translate('Number'), width: '10%', type: 'number'}, {
                    name: 'date',
                    title: translate('Date'),
                    type: 'date',
                    width: '10%'
                }, {
                    name: 'description',
                    title: translate('Description'),
                    type: 'string',
                    width: '30%'
                }, {name: 'amount', title: translate('Amount'), type: 'number', width: '10%', format: '{0:#,##}'}],
                commands: []
            };
            $scope.canShowCheques = false;

            $scope.$watch('gridOption.current', function (newValue) {
                if (!newValue) return $scope.canShowCheques = false;

                $scope.canShowCheques = false;

                $timeout(function () {
                    $scope.chequeGridOption.readUrl = constants.urls.cheque.all(newValue.id);

                    $scope.canShowCheques = true;
                }, 500);
            });

            $scope.create = function () {
                chequeCategoryCreateModalService.show().then(function () {
                    logger.success();
                    $scope.gridOption.refresh();
                });
            };
        }

        _acc2.default.controller('chequeCategoriesController', chequeCategoriesController);

    }, {"../acc.module": 2}],
    19: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function detailAccountCreateController($scope, logger, navigate, formService, detailAccountApi) {

            $scope.errors = [];

            $scope.detailAccount = {
                code: '',
                title: '',
                description: ''
            };

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) return formService.setDirty(form);

                $scope.errors.asEnumerable().removeAll();
                $scope.isSaving = true;

                detailAccountApi.create($scope.detailAccount).then(function () {
                    logger.success();
                    navigate('detailAccounts');
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };
        };

        _acc2.default.controller('detailAccountCreateController', detailAccountCreateController);

    }, {"../acc.module": 2}],
    20: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function detailAccountUpdateController($scope, logger, navigate, $routeParams, detailAccountApi) {

            var id = $routeParams.id;

            $scope.errors = [];

            $scope.detailAccount = {
                code: '',
                title: '',
                description: ''
            };

            $scope.isSaving = false;

            detailAccountApi.getById(id).then(function (result) {
                return $scope.detailAccount = result;
            });

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) return;
                $scope.errors.asEnumerable().removeAll();
                $scope.isSaving = true;

                detailAccountApi.create($scope.detailAccount).then(function () {
                    logger.success();
                    navigate('detailAccounts');
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.activate = function () {
                detailAccountApi.activate(id).then(function () {
                    $scope.detailAccount.isActive = true;
                    logger.success();
                }).catch(function (errors) {
                    return $scope.errors = errors;
                });
            };

            $scope.deactivate = function () {
                detailAccountApi.deactivate(id).then(function () {
                    $scope.detailAccount.isActive = false;
                    logger.success();
                }).catch(function (errors) {
                    return $scope.errors = errors;
                });
            };
        };

        _acc2.default.controller('detailAccountUpdateController', detailAccountUpdateController);

    }, {"../acc.module": 2}],
    21: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function detailAccountsController($scope, logger, translate, confirm, navigate, detailAccountApi) {
            "use strict";

            $scope.gridOption = {
                columns: [{name: 'code', title: translate('Code'), width: '120px', type: 'string'}, {
                    name: 'title',
                    title: translate('Title'),
                    type: 'string'
                }],
                commands: [{
                    title: translate('Edit'),
                    name: 'edit detail account',
                    action: function action(current) {
                        navigate('detailAccountUpdate', {id: current.id});
                    }
                }, {
                    title: translate('Remove'),
                    action: function action(current) {
                        confirm(translate('Remove Detail account'), translate('Are you sure ?')).then(function () {
                            detailAccountApi.remove(current.id).then(function () {
                                logger.success();
                                $scope.gridOption.refresh();
                            }).catch(function (errors) {
                                return $scope.errors = errors;
                            }).finally(function () {
                                return $scope.isSaving = false;
                            });
                        });
                    }
                }],
                readUrl: detailAccountApi.url.getAll
            };
        }

        _acc2.default.controller('detailAccountsController', detailAccountsController);

    }, {"../acc.module": 2}],
    22: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function dimensionsController($scope, logger, translate, confirm, dimensionCategoryApi, dimensionApi, dimensionCreateModalService, dimensionUpdateModalService) {
            "use strict";

            $scope.categories = [];
            $scope.currentCategory = {};

            dimensionCategoryApi.getAll().then(function (result) {
                var cats = result.data;

                $scope.categories = cats.asEnumerable().select(function (cat) {
                    return angular.extend({}, cat, {
                        gridOption: gridOptionFactory(cat),
                        editMode: 'read',
                        canShowDimensions: false,
                        errors: []
                    });
                }).toArray();
            });

            $scope.createCategory = function () {
                $scope.categories.push({
                    id: null,
                    title: '',
                    editMode: 'new',
                    canShowDimensions: false,
                    isSaving: false,
                    errors: []
                });
            };

            $scope.saveCategory = function (cat) {
                var cmd = {title: cat.title};

                if (cat.editMode == 'new') {
                    dimensionCategoryApi.create(cmd).then(function (result) {
                        cat.id = result.id;
                cat.editMode = 'read';
                        cat.gridOption = gridOptionFactory(cat);

                        logger.success();
                    }).catch(function (errors) {
                        return cat.errors = errors;
                    }).finally(function () {
                        return cat.isSaving = false;
                    });
                } else if (cat.editMode == 'edit') {
                    dimensionCategoryApi.update(cat.id, cmd).then(function () {
                        cat.editMode = 'read';
                        logger.success();
                    }).catch(function (errors) {
                        return cat.errors = errors;
                    }).finally(function () {
                        return cat.isSaving = false;
                    });
                }
            };

            $scope.startToEditingCategoryTitle = function (cat) {
                cat.originalData = {
                    title: cat.title
                };
                cat.editMode = 'edit';
            };

            $scope.cancelEditingCategoryTitle = function (cat) {
                cat.title = cat.originalData.title;
                cat.editMode = 'read';
            };

            $scope.changeShowDimensionStatus = function (cat) {
                cat.canShowDimensions = !cat.canShowDimensions;
            };

            $scope.createDimension = function (cat) {
                dimensionCreateModalService.show({categoryId: cat.id}).then(function () {
                    cat.gridOption.refresh();
                    logger.success();
                });
            };

            $scope.select = function (cat) {
                return $scope.currentCategory = cat;
            };

            function gridOptionFactory(cat) {
                var columns = [{name: 'code', title: translate('Code'), width: '120px', type: 'string'}, {
                    name: 'title',
                    title: translate('Title'),
                    type: 'string'
                }];

                var commands = [{
                    title: translate('Edit'),
                    action: function action(current) {
                        dimensionUpdateModalService.show({id: current.id}).then(function () {
                            getLocalCategoryById(current.categoryId).gridOption.refresh();
                            logger.success();
                });
            }
                }, {
                    title: translate('Remove'),
                    action: function action(current) {
                        confirm(translate('Remove Dimension'), translate('Are you sure ?')).then(function () {
                            dimensionApi.remove(current.id).then(function () {
                                getLocalCategoryById(current.categoryId).gridOption.refresh();
                                logger.success();
                            }).catch(function (err) {
                                err.errors.forEach(function (message) {
                                    logger.error(message);
                        });
                            });
                        });
            }
                }];

                return {
                    columns: columns,
                    commands: commands,
                    readUrl: dimensionApi.url.getAll(cat.id)
                };
            }

            function getLocalCategoryById(id) {
                var cat = $scope.categories.asEnumerable().first(function (c) {
                    return c.id == id;
                });

                return cat;
            }
        }

        _acc2.default.controller('dimensionsController', dimensionsController);

    }, {"../acc.module": 2}],
    23: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function generalLedgerAccountsController($scope, logger, translate, confirm, generalLedgerAccountApi, generalLedgerAccountCreateModalService, generalLedgerAccountUpdateModalService) {
            var columns = [{name: 'code', title: translate('Code'), width: '120px', type: 'string'}, {
                name: 'title',
                title: translate('Title'),
                type: 'string'
            }, {
                name: 'postingType',
                title: translate('Posting type'),
                type: 'postingType',
                width: '150px',
                template: '${data.postingTypeDisplay}'
            }, {
                name: 'balanceType',
                title: translate('Balance type'),
                type: 'balanceType',
                width: '150px',
                template: '${data.balanceTypeDisplay}'
            }, {
                name: 'isActive',
                title: translate('Is active ?'),
                type: 'activeType',
                width: '150px',
                template: '<i class="glyphicon glyphicon-${data.isActive ? "ok-circle" : "remove-circle"}"' + 'style="font-size: 20px;color:${data.isActive ? "green" : "red"}">' + '</i>'
            }];

            var commands = [{
                title: translate('Edit'),
                name: 'edit general ledger account',
                action: function action(current) {
                    generalLedgerAccountUpdateModalService.show({id: current.id}).then(function () {
                        $scope.gridOption.refresh();
                    });
                }
            }, {
                title: translate('Remove'),
                action: function action(current) {
                    confirm(translate('Remove General ledger account'), translate('Are you sure ?')).then(function () {
                        generalLedgerAccountApi.remove(current.id).then(function () {
                            logger.success();
                    $scope.gridOption.refresh();
                        }).catch(function (errors) {
                            return $scope.errors = errors;
                        }).finally(function () {
                            return $scope.isSaving = false;
                });
                    });
        }
            }];

            $scope.gridOption = {
                columns: columns,
                commands: commands,
                readUrl: generalLedgerAccountApi.url.getAll,
                current: null,
                selectable: true
            };

            $scope.create = function () {
                generalLedgerAccountCreateModalService.show().then(function () {
                    $scope.gridOption.refresh();
                });
            };
        }

        _acc2.default.controller('generalLedgerAccountsController', generalLedgerAccountsController);

    }, {"../acc.module": 2}],
    24: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function homeController($scope, $timeout, $route, $rootScope, periodApi, constants) {
            $scope.periodDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.period.all()
                    }
                },
                schema: {
                    data: 'data'
        }
            };

            $scope.periodOnChange = function (e) {
                var item = e.sender.dataItem();
            };
        }

        _acc2.default.controller('homeController', homeController);

    }, {"../acc.module": 2}],
    25: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalLineCreateOrUpdateController($scope, navigate, logger, journalLineApi, $routeParams, constants, formService, $q, $timeout) {

            var journalId = $routeParams.journalId;
            var id = $routeParams.id;
            var editMode = $scope.editMode = journalId == undefined ? 'update' : 'create';

            $scope.errors = [];

            $scope.journalLine = {
                generalLedgerAccountId: null,
                subsidiaryLedgerAccountId: null,
                detailAccountId: null,
                dimensions: [],
                description: '',
                amount: null,
                balanceType: ''
            };

            if (editMode == 'update') journalLineApi.getById(id).then(function (result) {
                result.amount = 0;
                result.balanceType = '';

                if (result.creditor > 0) {
                    result.amount = result.creditor;
                    result.balanceType = 'creditor';
        }

                if (result.debtor > 0) {
                    result.amount = result.debtor;
                    result.balanceType = 'debtor';
                }

                $scope.journalLine = result;
            });

            var resetForm = function resetForm(form) {

                $scope.journalLine = {
                    generalLedgerAccountId: null,
                    subsidiaryLedgerAccount: null,
                    detailAccountId: null,
                    description: '',
                    amount: null,
                    balanceType: ''
                };

                $timeout(function () {
                    return formService.setClean(form);
                }, 100);
            };

            $scope.isSaving = false;

            var save = function save(form) {
                var deferred = $q.defer();

                if (form.$invalid) {
                    formService.setDirty(form);
                    return;
                }

                $scope.isSaving = true;

                var journalLine = $scope.journalLine;

                var cmd = {
                    generalLedgerAccountId: journalLine.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: journalLine.subsidiaryLedgerAccountId,
                    detailAccountId: journalLine.detailAccountId,
                    description: journalLine.description,
                    amount: journalLine.amount,
                    balanceType: journalLine.balanceType
                };

                cmd.dimensions = $scope.journalLine.dimensions.asEnumerable().select(function (d) {
                    return {
                        categoryId: d.categoryId,
                        id: d.id
            };
                }).toArray();

                if (editMode == 'create') journalLineApi.create(journalId, cmd).then(function () {
                    deferred.resolve();
                    logger.success();
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });

                if (editMode == 'update') journalLineApi.update(id, cmd).then(function () {
                    deferred.resolve();
                    logger.success();
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });

                return deferred.promise;
            };

            $scope.saveAndNew = function (form) {
                save(form).then(function () {
                    return resetForm(form);
                });
            };

            $scope.saveAndReturn = function (form) {
                save(form).then(function () {
                    return navigate('journalUpdate', {id: journalId});
                });
            };

            $scope.generalLedgerAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.generalLedgerAccount.all()
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            $scope.generalLedgerAccountOnChange = function () {
                $scope.journalLine.subsidiaryLedgerAccountId = null;

                $scope.journalLine.dimensions = [];
                $scope.journalLine.detailAccount = {
                    canShow: false,
                    isRequired: false
                };
            };

            $scope.subsidiaryLedgerAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: function url(filter) {
                            var generalLegerAccountId = filter.filter.filters.asEnumerable().first(function (f) {
                                return f.field == 'generalLedgerAccountId';
                            }).value;

                            return constants.urls.subsidiaryLedgerAccount.allByGeneralLedgerAccount(generalLegerAccountId);
                }
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            $scope.subsidiaryLedgerAccountSelect = function (e) {
                var item = e.sender.dataItem();

                if (!item) {
                    $scope.journalLine.dimensions = [];
                    $scope.journalLine.detailAccount = {
                        canShow: false,
                        isRequired: false
            };

                    return;
                }

                $scope.journalLine.dimensions = Array.from(item.dimensionAssignmentStatus).asEnumerable().select(function (dimensionStatus) {
                    return {
                        id: getDimensionId(dimensionStatus.id),
                        canShow: constants.enums.AssignmentStatus().getKeys('Required', 'NotRequired').asEnumerable().contains(dimensionStatus.status),
                        isRequired: dimensionStatus.status == constants.enums.AssignmentStatus().getKey('Required'),
                        categoryId: dimensionStatus.id,
                        categoryTitle: dimensionStatus.title,
                        dataSource: dimensionDataSource(dimensionStatus.id)
            };
                }).toArray();

                $scope.journalLine.detailAccount = {
                    canShow: constants.enums.AssignmentStatus().getKeys('Required', 'NotRequired').asEnumerable().contains(item.detailAccountAssignmentStatus),
                    isRequired: item.detailAccountAssignmentStatus == constants.enums.AssignmentStatus().getKey('Required')
                };
            };

            $scope.subsidiaryLedgerAccountDataBound = function (e) {
                return e.sender.trigger('change');
            };

            $scope.detailAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.detailAccount.all()
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            var dimensionDataSource = function dimensionDataSource(categoryId) {
                return {
                    type: "json",
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: constants.urls.dimension.allByCategory(categoryId)
                }
                    },
                    schema: {
                        data: 'data'
                    }
                };
            };

            $scope.changeAmountBalance = function () {
                return $scope.journalLine.balanceType = $scope.journalLine.balanceType == 'debtor' ? 'creditor' : 'debtor';
            };

            var getDimensionId = function getDimensionId(categoryId) {
                var dimensions = $scope.journalLine.dimensions;

                if (dimensions == null) return null;

                if (!dimensions.asEnumerable().any(function (d) {
                        return d.categoryId == categoryId;
                    })) return null;

                return dimensions.asEnumerable().single(function (d) {
                    return d.categoryId == categoryId;
                }).id;
            };
        }

        _acc2.default.controller('journalLineCreateController', journalLineCreateOrUpdateController).controller('journalLineUpdateController', journalLineCreateOrUpdateController);

    }, {"../acc.module": 2}],
    26: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalLineUpdateController($scope, navigate, logger, journalLineApi, $routeParams, constants, formService, $q, $timeout) {

            var id = $routeParams.id;

            $scope.errors = [];

            $scope.journalLine = {
                generalLedgerAccountId: null,
                subsidiaryLedgerAccountId: null,
                detailAccountId: null,
                dimensions: [],
                description: '',
                amount: null,
                balanceType: ''
            };

            var resetForm = function resetForm(form) {

                $scope.journalLine = {
                    generalLedgerAccountId: null,
                    subsidiaryLedgerAccount: null,
                    detailAccountId: null,
                    description: '',
                    amount: null,
                    balanceType: ''
                };

                $timeout(function () {
                    return formService.setClean(form);
                }, 100);
            };

            $scope.isSaving = false;

            var save = function save(form) {
                var deferred = $q.defer();

                if (form.$invalid) {
                    formService.setDirty(form);
                    return;
        }

                $scope.isSaving = true;

                var journalLine = $scope.journalLine;

                var cmd = {
                    generalLedgerAccountId: journalLine.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: journalLine.subsidiaryLedgerAccount.id,
                    detailAccountId: journalLine.detailAccountId,
                    description: journalLine.description,
                    amount: journalLine.amount,
                    balanceType: journalLine.balanceType
                };

                cmd.dimensions = $scope.journalLine.subsidiaryLedgerAccount.dimensions.asEnumerable().select(function (d) {
                    return {
                        categoryId: d.categoryId,
                        id: d.id
            };
                }).toArray();

                journalLineApi.create(journalId, cmd).then(function () {
                    deferred.resolve();
                    logger.success();
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });

                return deferred.promise;
            };

            $scope.saveAndNew = function (form) {
                save(form).then(function () {
                    return resetForm(form);
                });
            };

            $scope.saveAndReturn = function (form) {
                save(form).then(function () {
                    return navigate('journalUpdate', {id: journalId});
                });
            };

            $scope.generalLedgerAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.generalLedgerAccount.all()
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            $scope.generalLedgerAccountOnChange = function () {
                $scope.journalLine.subsidiaryLedgerAccountId = null;

                $scope.journalLine.dimensions = [];
                $scope.journalLine.detailAccount = {
                    canShow: false,
                    isRequired: false
                };
            };

            $scope.subsidiaryLedgerAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: function url(filter) {
                            var generalLegerAccountId = filter.filter.filters.asEnumerable().first(function (f) {
                                return f.field == 'generalLedgerAccountId';
                            }).value;

                            return constants.urls.subsidiaryLedgerAccount.allByGeneralLedgerAccount(generalLegerAccountId);
                }
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            $scope.subsidiaryLedgerAccountDataBound = function (e) {
                return e.sender.trigger('change');
            };

            $scope.detailAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.detailAccount.all()
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            var dimensionDataSource = function dimensionDataSource(categoryId) {
                return {
                    type: "json",
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: constants.urls.dimension.allByCategory(categoryId)
                }
                    },
                    schema: {
                        data: 'data'
                    }
                };
            };

            var getDimensionId = function getDimensionId(categoryId) {
                var dimensions = $scope.journalLine.dimensions;

                if (dimensions == null) return null;

                if (!dimensions.asEnumerable().any(function (d) {
                        return d.categoryId == categoryId;
                    })) return null;

                return dimensions.asEnumerable().single(function (d) {
                    return d.categoryId == categoryId;
                }).id;
            };

            $scope.changeAmountBalance = function () {
                return $scope.journalLine.balanceType = $scope.journalLine.balanceType == 'debtor' ? 'creditor' : 'debtor';
            };

            $scope.subsidiaryLedgerAccountSelect = function (e) {
                var item = e.sender.dataItem();

                if (!item) {
                    $scope.journalLine.dimensions = [];
                    $scope.journalLine.detailAccount = {
                        canShow: false,
                        isRequired: false
            };

                    return;
                }

                $scope.journalLine.dimensions = Array.from(item.dimensionAssignmentStatus).asEnumerable().select(function (dimensionStatus) {
                    return {
                        id: getDimensionId(dimensionStatus.id),
                        canShow: constants.enums.AssignmentStatus().getKeys('Required', 'NotRequired').asEnumerable().contains(dimensionStatus.status),
                        isRequired: dimensionStatus.status == constants.enums.AssignmentStatus().getKey('Required'),
                        categoryId: dimensionStatus.id,
                        categoryTitle: dimensionStatus.title,
                        dataSource: dimensionDataSource(dimensionStatus.id)
            };
                }).toArray();

                $scope.journalLine.detailAccount = {
                    canShow: constants.enums.AssignmentStatus().getKeys('Required', 'NotRequired').asEnumerable().contains(item.detailAccountAssignmentStatus),
                    isRequired: item.detailAccountAssignmentStatus == constants.enums.AssignmentStatus().getKey('Required')
                };
            };
        }

//accModule.controller('journalLineUpdateController', journalLineUpdateController);

    }, {"../acc.module": 2}],
    27: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalUpdateController($scope, logger, confirm, translate, navigate, $routeParams, journalApi, journalLineApi, journalLineCreateControllerModalService, journalLineUpdateControllerModalService, journalBookkeepingService, journalAttachImageService) {

            var id = $routeParams.id;
            $scope.errors = [];
            $scope.journal = {
                temporaryNumber: null,
                temporaryDate: null,
                number: null,
                date: null,
                description: ''
            };

            $scope.canShowNumberAndDate = false;

            function fetch() {
                journalApi.getById(id).then(function (result) {
                    $scope.journal = result;

                    $scope.canShowNumberAndDate = result.journalStatus != 'Temporary';
                });
            }

            fetch();

            $scope.gridOption = {
                columns: [{name: 'row', title: translate('Row'), width: '60px', type: 'number'}, {
                    name: 'generalLedgerAccountId',
                    title: translate('General ledger account'),
                    type: 'generalLedgerAccount',
                    template: '${data.generalLedgerAccountCode}',
                    width: '70px'
                }, {
                    name: 'subsidiaryLedgerAccountId',
                    title: translate('Subsidiary ledger account'),
                    type: 'subsidiaryLedgerAccount',
                    template: '${data.subsidiaryLedgerAccountCode}',
                    width: '70px'
                }, {
                    name: 'detailAccountId',
                    title: translate('Detail account'),
                    type: 'detailAccount',
                    template: '${data.detailAccountCode}',
                    width: '100px'
                }, {name: 'article', title: translate('Article'), width: '300px', type: 'string'}, {
                    name: 'debtor', title: translate('Debtor'), width: '100px', type: 'number', format: '{0:#,##}',
                    aggregates: ['sum'], footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
                }, {
                    name: 'creditor', title: translate('Creditor'), width: '100px', type: 'number', format: '{0:#,##}',
                    aggregates: ['sum'], footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
                }],
                commands: [{
                    title: translate('Edit'),
                    action: function action(current) {
                        journalLineUpdateControllerModalService.show({
                            journalId: id,
                            id: current.id
                        }).then(function () {
                            return $scope.gridOption.refresh();
                });
            }
                }, {
                    title: translate('Remove'),
                    action: function action(current) {
                        confirm(translate('Remove General ledger account'), translate('Are you sure ?')).then(function () {
                            journalLineApi.remove(current.id).then(function () {
                                logger.success();
                                $scope.gridOption.refresh();
                            }).catch(function (errors) {
                                return logger.error(errors.join('<b/>'));
                            });
                        });
                    }
                }],
                current: null,
                selectable: true,
                filterable: false,
                readUrl: journalLineApi.url.getAll(id)
            };

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) return;

                $scope.errors.asEnumerable().removeAll();

                $scope.isSaving = true;

                journalApi.update(id, $scope.journal).then(function () {
                    logger.success();
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.createJournalLine = function () {
                journalLineCreateControllerModalService.show({journalId: id}).then(function () {
                    return $scope.gridOption.refresh();
                });
            };

            $scope.bookkeeping = function () {
                journalBookkeepingService.show({id: id}).then(function () {
                    logger.success();
                    fetch();
                });
            };

            $scope.attachImage = function () {
                journalAttachImageService.show({id: id}).then(function () {
                    logger.success();
                    fetch();
                });
            };
        }

        _acc2.default.controller('journalUpdateController', journalUpdateController);

    }, {"../acc.module": 2}],
    28: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalsController($scope, translate, journalApi, navigate, logger, journalCreateModalControllerService) {

            $scope.gridOption = {
                columns: [{name: 'number', title: translate('Number'), width: '120px', type: 'number'}, {
                    name: 'date',
                    title: translate('Date'),
                    type: 'date'
                }, {
                    name: 'temporaryNumber',
                    title: translate('Temporary number'),
                    width: '120px',
                    type: 'number'
                }, {name: 'temporaryDate', title: translate('Temporary date'), type: 'date'}, {
                    name: 'journalStatus',
                    title: translate('Journal status'),
                    type: 'journalStatus',
                    template: '${data.journalStatusDisplay}'
                }, {
                    name: 'sumDebtor',
                    title: translate('sum debtor'),
                    type: 'number',
                    format: '{0:#,##}',
                    filterable: false
                }, {
                    name: 'sumCreditor',
                    title: translate('sum creditor'),
                    type: 'number',
                    format: '{0:#,##}',
                    filterable: false
                }],
                commands: [{
                    title: translate('Edit'),
                    action: function action(current) {
                        navigate('journalUpdate', {
                            id: current.id
                });
                    }
                }],
                readUrl: journalApi.url.getAll
            };

            $scope.create = function () {
                journalCreateModalControllerService.show().then(function (result) {
                    logger.success();
                    navigate('journalUpdate', {
                        id: result.id
                    });
                });
            };
        }

        _acc2.default.controller('journalsController', journalsController);

    }, {"../acc.module": 2}],
    29: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function shellController($scope, menuItems, translate, $rootScope) {
            "use strict";

            $scope.isToggleMenuOpen = false;
            $scope.menuItems = menuItems;

            $rootScope.blockUi = {
                isBlocking: false,
                message: translate('Please wait ...'),
                block: function block(message) {
                    $rootScope.blockUi.message = message ? message : translate('Please wait ...');

                    $rootScope.blockUi.isBlocking = true;
                },
                unBlock: function unBlock() {
                    $rootScope.blockUi.isBlocking = false;
        }
            };

            $scope.toggle = function () {
                if ($scope.isToggleMenuOpen) $scope.isToggleMenuOpen = false; else $scope.isToggleMenuOpen = true;
            };
        }

        _acc2.default.controller('shellController', shellController);

    }, {"../acc.module": 2}],
    30: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function subsidiaryLedgerAccountCreateController($scope, logger, navigate, $routeParams, constants, formService, subsidiaryLedgerAccountApi, dimensionCategoryApi) {

            var generalLedgerAccountId = $routeParams.generalLedgerAccountId;

            $scope.errors = [];
            $scope.assignmentStatus = constants.enums.AssignmentStatus().data;

            $scope.subsidiaryLedgerAccount = {
                code: '',
                title: '',
                detailAccountAssignmentStatus: null,
                isBankAccount: false,
                dimension1AssignmentStatus: null,
                dimension2AssignmentStatus: null,
                dimension3AssignmentStatus: null
            };

            $scope.dimensionCategories = [];

            dimensionCategoryApi.getAll().then(function (result) {
                $scope.dimensionCategories = result.data;
            });

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) {
                    formService.setDirty(form);
                    return;
        }

                $scope.isSaving = true;

                subsidiaryLedgerAccountApi.create(generalLedgerAccountId, $scope.subsidiaryLedgerAccount).then(function () {
                    logger.success();
                    navigate('subsidiaryLedgerAccounts', {generalLedgerAccountId: generalLedgerAccountId});
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };
        }

        _acc2.default.controller('subsidiaryLedgerAccountCreateController', subsidiaryLedgerAccountCreateController);

    }, {"../acc.module": 2}],
    31: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function subsidiaryLedgerAccountUpdateController($scope, logger, navigate, constants, $routeParams, formService, subsidiaryLedgerAccountApi, dimensionCategoryApi) {
            var id = $routeParams.id;

            $scope.errors = [];
            $scope.assignmentStatus = new constants.enums.AssignmentStatus().data;
            $scope.dimensionCategories = [];

            $scope.subsidiaryLedgerAccount = {
                code: '',
                title: '',
                detailAccountAssignmentStatus: null,
                isBankAccount: false,
                dimension1AssignmentStatus: null,
                dimension2AssignmentStatus: null,
                dimension3AssignmentStatus: null,
                isActive: true
            };

            dimensionCategoryApi.getAll().then(function (result) {
                $scope.dimensionCategories = result.data;
            });

            subsidiaryLedgerAccountApi.getById(id).then(function (result) {
                return $scope.subsidiaryLedgerAccount = result;
            });

            $scope.isSaving = false;

            $scope.save = function (form) {

                if (form.$invalid) {
                    formService.setDirty(form);
                    return;
        }

                $scope.isSaving = true;

                subsidiaryLedgerAccountApi.update(id, $scope.subsidiaryLedgerAccount).then(function () {
                    logger.success();
                    navigate('subsidiaryLedgerAccounts', {
                        generalLedgerAccountId: $scope.subsidiaryLedgerAccount.generalLedgerAccountId
                    });
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.isActivating = false;

            $scope.activate = function () {
                $scope.isActivating = true;

                subsidiaryLedgerAccountApi.activate(id).then(function () {
                    logger.success();
                    $scope.subsidiaryLedgerAccount.isActive = true;
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isActivating = false;
                });
            };

            $scope.isDeactivating = false;

            $scope.deactivate = function () {
                $scope.isDeactivating = true;

                subsidiaryLedgerAccountApi.deactivate(id).then(function () {
                    logger.success();
                    $scope.subsidiaryLedgerAccount.isActive = false;
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isDeactivating = false;
                });
            };
        }

        _acc2.default.controller('subsidiaryLedgerAccountUpdateController', subsidiaryLedgerAccountUpdateController);

    }, {"../acc.module": 2}],
    32: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function subsidiaryLedgerAccountsController($scope, logger, confirm, navigate, $routeParams, translate, subsidiaryLedgerAccountApi) {

            var generalLedgerAccountId = $routeParams.generalLedgerAccountId;

            $scope.gridOption = {
                columns: [{name: 'code', title: translate('Code'), width: '200px', type: 'string'}, {
                    name: 'title',
                    title: translate('Title'),
                    type: 'string'
                }, {
                    name: 'isActive',
                    title: translate('Is active ?'),
                    type: 'activeType',
                    width: '170px',
                    template: '<i class="glyphicon glyphicon-${data.isActive ? "ok-circle" : "remove-circle"}"' + 'style="font-size: 20px;color:${data.isActive ? "green" : "red"}">' + '</i>'
                }],
                commands: [{
                    title: translate('Edit'),
                    name: 'editSubsidiaryLedgerAccount',
                    action: function action(current) {
                        navigate('subsidiaryLedgerAccountUpdate', {
                            id: current.id
                        });
                    }
                }, {
                    title: translate('Remove'),
                    action: function action(current) {
                        confirm(translate('Remove Subsidiary ledger account'), translate('Are you sure ?')).then(function () {
                            subsidiaryLedgerAccountApi.remove(current.id).then(function () {
                                logger.success();
                                $scope.gridOption.refresh();
                            }).catch(function (errors) {
                                return $scope.errors = errors;
                    });
                });
                    }
                }],
                readUrl: subsidiaryLedgerAccountApi.url.getAll(generalLedgerAccountId)
            };

            $scope.create = function () {
                navigate('subsidiaryLedgerAccountCreate', {
                    generalLedgerAccountId: generalLedgerAccountId
                });
            };
        }

        _acc2.default.controller('subsidiaryLedgerAccountsController', subsidiaryLedgerAccountsController);

    }, {"../acc.module": 2}],
    33: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function alertTag() {
            var alertType = {
                warning: {icon: 'warning-sign'},
                success: {icon: 'ok-sign'},
                danger: {icon: 'remove-sign'},
                info: {icon: 'info=sign'}
            };
            return {
                restrict: 'E',
                template: '<div class="alert alert-{{type}}" role="alert" style="margin-top: 10px"' + 'ng-if="show">' + '<span class="glyphicon glyphicon-{{icon}}"></span>' + '<label>{{text}}</label>' + '</div>',
                scope: {
                    show: '='
                },
                link: function link(scope, element, attrs) {
                    scope.text = attrs.text;
                    scope.type = attrs.type;
                    scope.icon = alertType[scope.type].icon;
        }
            };
        }

        _acc2.default.directive('devTagAlert', alertTag);

    }, {"../acc.module": 2}],
    34: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function blockUi() {
            return {
                restrict: 'E',
                templateUrl: 'partials/templates/blockUi.html',
                transclude: true,
                link: function link(scope, element, attrs) {
                }
            };
        }

        _acc2.default.directive('devTagBlockUi', blockUi);

    }, {"../acc.module": 2}],
    35: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function customValidator() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function link(scope, element, attr, ctrl) {

                    function customValidator(ngModelValue) {
                        if (ngModelValue == 0) ctrl.$setValidity('notZero', false); else ctrl.$setValidity('notZero', true);

                        return ngModelValue;
                    }

                    ctrl.$parsers.push(customValidator);
        }
            };
        }

        _acc2.default.directive('notZero', customValidator);

    }, {"../acc.module": 2}],
    36: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        _acc2.default.directive('focusMe', function ($timeout, $parse) {
            return {
                link: function link(scope, element, attrs) {
                    var model = $parse(attrs.focusMe);
                    scope.$watch(model, function (value) {
                        console.log('value=', value);
                        if (value === true) {
                            $timeout(function () {
                                element[0].focus();
                            }, 3000);
                }
                    });
                    element.bind('blur', function () {
                        console.log('blur');
                        model.assign(scope, false);
                    });
        }
            };
        });

    }, {"../acc.module": 2}],
    37: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function subContent() {
            return {
                restrict: 'E',
                templateUrl: 'partials/templates/subContent.html',
                transclude: true,
                replace: true,
                scope: {},
                link: function link(scope, element, attrs) {
                    scope.title = attrs.title;
        }
            };
        }

        _acc2.default.directive('devTagSubContent', subContent);

    }, {"../acc.module": 2}],
    38: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        var _jquery = require('jquery');

        var _jquery2 = _interopRequireDefault(_jquery);

        require('jquery.filedrop');

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function uploader($rootScope, logger) {
            return {
                restrict: 'E',
                templateUrl: 'partials/templates/uploader.html',
                replace: true,
                scope: {
                    before: '&',
                    uploaded: '&'
                },
                link: function link(scope, element, attrs) {

                    (0, _jquery2.default)(element).filedrop({
                        url: '/upload',
                        dragOver: function dragOver() {
                            var $elm = (0, _jquery2.default)(element).find('.place_drag');
                            $elm.addClass('place_drag_uploader');
                            $elm.find('.hover_upload_list').addClass('webfont_file');
                },
                        dragLeave: function dragLeave() {
                            var $elm = (0, _jquery2.default)(element).find('.place_drag');
                            $elm.removeClass('place_drag_uploader');
                            $elm.find('.hover_upload_list').removeClass('webfont_file');
                            $elm.find('.place_drag_text1').show();
                        },
                        uploadStarted: function uploadStarted() {
                            var $elm = (0, _jquery2.default)(element).find('.place_drag');
                            $elm.removeClass('place_drag_uploader');
                            $elm.find('.hover_upload_list').removeClass('webfont_file');
                            $elm.find('.place_drag_text1').hide();

                            $rootScope.blockUi.block();
                            scope.$apply();

                            scope.before();
                        },
                        uploadFinished: function uploadFinished(i, file, response, time) {
                            scope.uploaded(response);
                            $rootScope.blockUi.unBlock();
                            scope.$apply();
                        },
                        error: function error(err, file) {
                            $rootScope.blockUi.unBlock();
                            scope.$apply();

                            switch (err) {
                                case 'BrowserNotSupported':
                                    logger.error('browser does not support HTML5 drag and drop');
                                    break;
                                case 'TooManyFiles':
                                    // user uploaded more than 'maxfiles'
                                    break;
                                case 'FileTooLarge':
                                    // program encountered a file whose size is greater than 'maxfilesize'
                                    // FileTooLarge also has access to the file which was too large
                                    // use file.name to reference the filename of the culprit file
                                    break;
                                case 'FileTypeNotAllowed':
                                    // The file type is not in the specified list 'allowedfiletypes'
                                    break;
                                case 'FileExtensionNotAllowed':
                                    // The file extension is not in the specified list 'allowedfileextensions'
                                    break;
                                default:
                                    break;
                            }
                }
                    });
        }
            };
        }

        _acc2.default.directive('devTagUploader', uploader);

    }, {"../acc.module": 2, "jquery": "jquery", "jquery.filedrop": "jquery.filedrop"}],
    39: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function validationSummary() {
            return {
                restrict: 'E',
                templateUrl: 'partials/templates/validationSummary.html',
                replace: true,
                scope: {
                    errors: '='
        }
            };
        }

        _acc2.default.directive('devTagValidationSummary', validationSummary);

    }, {"../acc.module": 2}],
    40: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function amount() {
            return function (input) {
                if (!input) return '';

                return kendo.toString(input, 'n0');
            };
        }

        _acc2.default.filter('amount', amount);

    }, {"../acc.module": 2}],
    41: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var isClientTest = function isClientTest() {
            var isClientTest = localStorage.getItem('isClientTest');

            return isClientTest == null ? false : true;
        };

        var baseTemplateUrl = function baseTemplateUrl() {
            return isClientTest() ? 'partials/' : '';
        };

        var config = {
            isClientTest: isClientTest,
            baseTemplateUrl: baseTemplateUrl
        };

        exports.default = config;

    }, {}],
    42: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _enums = require('./enums');

        var _enums2 = _interopRequireDefault(_enums);

        var _urls = require('./urls');

        var _urls2 = _interopRequireDefault(_urls);

        var _config = require('./config');

        var _config2 = _interopRequireDefault(_config);

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        var constants = {
            enums: _enums2.default,
            urls: _urls2.default,
            config: _config2.default
        };

        _acc2.default.constant('constants', constants);

        exports.default = constants;

    }, {"../acc.module": 2, "./config": 41, "./enums": 44, "./urls": 45}],
    43: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var Enum = function () {
            function Enum(enums) {
                _classCallCheck(this, Enum);

                this.data = enums;
            }

            _createClass(Enum, [{
                key: "getKey",
                value: function getKey(name) {
                    return this.data.asEnumerable().single(function (e) {
                        return e.name == name;
                    }).key;
                }
            }, {
                key: "getKeys",
                value: function getKeys() {
                    var _this = this;

                    var names = Array.from(arguments);

                    return names.asEnumerable().select(function (name) {
                        return _this.getKey(name);
                    }).toArray();
                }
            }, {
                key: "get",
                value: function get() {
                    return this.data;
                }
            }]);

            return Enum;
        }();

        exports.default = Enum;

    }, {}],
    44: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _enumType = require('./enumType');

        var _enumType2 = _interopRequireDefault(_enumType);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        var enums = {};

        enums.AccountPostingType = function () {
            return new _enumType2.default([{key: 'balanceSheet', display: 'تراز نامه ای'}, {
                key: 'benefitAndLoss',
                display: 'سود و زیانی'
            }]);
        };

        enums.AccountBalanceType = function () {
            return new _enumType2.default([{key: 'debit', display: 'بدهکار'}, {key: 'credit', display: 'بستانکار'}]);
        };

        enums.AssignmentStatus = function () {
            return new _enumType2.default([{key: 'Required', display: 'اجباری است'}, {
                key: 'NotRequired',
                display: 'انتخابی است'
            }, {key: 'DoesNotHave', display: 'ندارد'}]);
        };

        enums.JournalType = function () {
            return new _enumType2.default([{key: 'Opening', display: 'افتتاحیه'}, {
                key: 'Closing',
                display: 'اختتامیه'
            }]);
        };

        enums.JournalStatus = function () {
            return new _enumType2.default([{key: 'Temporary', display: 'موقت'}, {
                key: 'BookKeeped',
                display: 'ثبت دفترداری'
            }, {key: 'Fixed', display: 'ثبت قطعی'}]);
        };

        enums.Active = function () {
            return new _enumType2.default([{key: true, name: 'showActiveItems', display: 'نمایش فعال ها'}, {
                key: false,
                name: 'showInactiveItems',
                display: 'نمایش غیر فعال ها'
            }]);
        };

        enums.ChequeCategoryStatus = function () {
            return new _enumType2.default([{key: 'Open', display: 'باز'}, {key: 'Closed', display: 'بسته'}]);
        };

        exports.default = enums;

    }, {"./enumType": 43}],
    45: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var rootUrl = function rootUrl() {
            return '/api';
        };

        var generalLedgerAccount = {
            all: function all() {
                return '{0}/general-ledger-accounts'.format(rootUrl());
            }
        };

        var subsidiaryLedgerAccount = {
            all: function all() {
                return '{0}/subsidiary-ledger-accounts'.format(rootUrl());
            },
            allByGeneralLedgerAccount: function allByGeneralLedgerAccount(generalLedgerAccountId) {
                return '{0}/subsidiary-ledger-accounts/general-ledger-account/{1}'.format(rootUrl(), generalLedgerAccountId);
            }
        };

        var detailAccount = {
            all: function all() {
                return '{0}/detail-accounts'.format(rootUrl());
            }
        };

        var dimension = {
            allByCategory: function allByCategory(categoryId) {
                return '{0}/dimensions/category/{1}'.format(rootUrl(), categoryId);
            }
        };

        var period = {
            all: function all() {
                return '{0}/periods'.format(rootUrl());
            }
        };

        var chequeCategory = {
            all: function all() {
                return '{0}/cheque-categories'.format(rootUrl());
            },
            allOpens: function allOpens(detailAccountId) {
                return '{0}/cheque-categories/detail-account/{1}'.format(rootUrl(), detailAccountId);
            }
        };

        var bank = {
            all: function all() {
                return '{0}/banks'.format(rootUrl());
            }
        };

        var cheque = {
            all: function all(categoryId) {
                return '{0}/cheques/category/{1}'.format(rootUrl(), categoryId);
            },
            allwrites: function allwrites(categoryId) {
                return '{0}/cheques/category/{1}/writes'.format(rootUrl(), categoryId);
            }
        };

        var apiUrls = {
            generalLedgerAccount: generalLedgerAccount,
            subsidiaryLedgerAccount: subsidiaryLedgerAccount,
            detailAccount: detailAccount,
            dimension: dimension,
            period: period,
            chequeCategory: chequeCategory,
            bank: bank,
            cheque: cheque
        };

        exports.default = apiUrls;

    }, {}],
    46: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function chequeCategoryCreateModalController($scope, $modalInstance, formService, chequeCategoryApi, logger, constants) {
            "use strict";

            $scope.errors = [];
            $scope.chequeCategory = {
                bankId: '',
                detailAccountId: null,
                totalPages: null,
                firstPageNumber: null
            };

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) return formService.setDirty(form);

                $scope.errors.asEnumerable().removeAll();
                $scope.isSaving = true;

                chequeCategoryApi.create($scope.chequeCategory).then(function (result) {
                    logger.success();
                    $modalInstance.close(result);
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.lastPageNumber = function () {
                var model = $scope.chequeCategory;

                return model.firstPageNumber && model.totalPages ? model.firstPageNumber + model.totalPages - 1 : null;
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };

            $scope.detailAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.detailAccount.all()
                    }
                },
                schema: {
                    data: 'data'
        }
            };

            $scope.bankDataSource = {
                type: 'json',
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.bank.all()
                    }
                },
                schema: {
                    data: 'data'
        }
            };
        }

        function chequeCategoryCreateModalService(modalBase) {
            return modalBase({
                controller: chequeCategoryCreateModalController,
                templateUrl: 'partials/modals/chequeCategoryCreate.html'
            });
        }

        _acc2.default.controller('chequeCategoryCreateModalController', chequeCategoryCreateModalController).factory('chequeCategoryCreateModalService', chequeCategoryCreateModalService);

    }, {"../acc.module": 2}],
    47: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function chequeCategoryUpdateModalController($scope, $modalInstance, formService, chequeCategoryApi, logger, data, constants) {
            "use strict";

            var id = data.id;
            $scope.errors = [];
            $scope.chequeCategory = {
                bankId: '',
                detailAccountId: null,
                totalPages: null,
                firstPageNumber: null
            };

            chequeCategoryApi.getById(id).then(function (result) {
                return $scope.chequeCategory = result;
            });

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) return formService.setDirty(form);

                $scope.errors.asEnumerable().removeAll();
                $scope.isSaving = true;

                chequeCategoryApi.update($scope.chequeCategory).then(function (result) {
                    logger.success();
                    $modalInstance.close(result);
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.lastPageNumber = function () {
                var model = $scope.chequeCategory;

                return model.firstPageNumber && model.totalPages ? model.firstPageNumber + model.totalPages - 1 : null;
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };

            $scope.detailAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.detailAccount.all()
                    }
                },
                schema: {
                    data: 'data'
        }
            };

            $scope.bankDataSource = {
                type: 'json',
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.bank.all()
                    }
                },
                schema: {
                    data: 'data'
        }
            };
        }

        function chequeCategoryUpdateModalService(modalBase) {
            return modalBase({
                controller: chequeCategoryUpdateModalController,
                templateUrl: 'partials/modals/chequeCategoryUpdate.html'
            });
        }

        _acc2.default.controller('chequeCategoryUpdateModalController', chequeCategoryUpdateModalController).factory('chequeCategoryUpdateModalService', chequeCategoryUpdateModalService);

    }, {"../acc.module": 2}],
    48: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        var _config = require('../localData/config');

        var _config2 = _interopRequireDefault(_config);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function dimensionCreateModalController(data, $scope, $modalInstance, dimensionApi) {
            "use strict";

            $scope.errors = [];
            $scope.dimension = {
                title: '',
                code: '',
                description: ''
            };

            $scope.save = function (form) {
                if (form.$invalid) return;

                $scope.errors.asEnumerable().removeAll();

                dimensionApi.create(data.categoryId, $scope.dimension).then(function (result) {
                    $modalInstance.close(result);
                }).catch(function (errors) {
                    $scope.errors = errors;
        });
            };

            $scope.close = function () {
                $modalInstance.dismiss();
            };
        }

        function dimensionCreateModalService(modalBase) {
            return modalBase({
                controller: dimensionCreateModalController,
                templateUrl: 'partials/modals/dimensionCreate.html'
            });
        }

        _acc2.default.controller('dimensionCreateModalController', dimensionCreateModalController).factory('dimensionCreateModalService', dimensionCreateModalService);

    }, {"../acc.module": 2, "../localData/config": 41}],
    49: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function dimensionUpdateModalController(data, $scope, $modalInstance, dimensionApi) {
            "use strict";

            $scope.errors = [];
            $scope.dimension = {
                title: '',
                code: '',
                description: ''
            };

            dimensionApi.getById(data.id).then(function (result) {
                return $scope.dimension = result;
            });

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) return;

                $scope.errors.asEnumerable().removeAll();
                $scope.isSaving = true;

                dimensionApi.update(data.id, $scope.dimension).then(function (result) {
                    $modalInstance.close(result);
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };
        }

        function dimensionUpdateModalService(modalBase) {
            return modalBase({
                controller: dimensionUpdateModalController,
                templateUrl: 'partials/modals/dimensionUpdate.html'
            });
        }

        _acc2.default.controller('dimensionUpdateModalController', dimensionUpdateModalController).factory('dimensionUpdateModalService', dimensionUpdateModalService);

    }, {"../acc.module": 2}],
    50: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        var _constants = require('../localData/constants');

        var _constants2 = _interopRequireDefault(_constants);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function generalLedgerAccountCreateModalController($scope, $modalInstance, generalLedgerAccountApi, logger, formService) {

            $scope.errors = [];
            $scope.generalLedgerAccount = {
                title: '',
                code: '',
                postingType: null,
                balanceType: null,
                description: ''
            };

            $scope.isSaving = false;
            $scope.save = function (form) {
                if (form.$invalid) {
                    formService.setDirty(form);
                    return;
        }

                $scope.errors.asEnumerable().removeAll();

                $scope.isSaving = true;

                generalLedgerAccountApi.create($scope.generalLedgerAccount).then(function (result) {
                    logger.success();
                    $modalInstance.close(result);
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.close = function () {
                $modalInstance.dismiss();
            };

            $scope.accountPostingType = _constants2.default.enums.AccountPostingType();
            $scope.accountBalanceType = _constants2.default.enums.AccountBalanceType();
        }

        function generalLedgerAccountCreateModalService(modalBase) {
            return modalBase({
                controller: generalLedgerAccountCreateModalController,
                templateUrl: 'partials/modals/generalLedgerAccountCreate.html'
            });
        }

        _acc2.default.controller('generalLedgerAccountCreateModalController', generalLedgerAccountCreateModalController).factory('generalLedgerAccountCreateModalService', generalLedgerAccountCreateModalService);

    }, {"../acc.module": 2, "../localData/constants": 42}],
    51: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        var _constants = require('../localData/constants');

        var _constants2 = _interopRequireDefault(_constants);

        var _config = require('../localData/config');

        var _config2 = _interopRequireDefault(_config);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function generalLedgerAccountUpdateModalController($scope, $modalInstance, data, generalLedgerAccountApi, logger, formService) {

            $scope.errors = [];
            $scope.generalLedgerAccount = {
                title: '',
                code: '',
                postingType: null,
                balanceType: null,
                description: ''
            };

            generalLedgerAccountApi.getById(data.id).then(function (result) {
                $scope.generalLedgerAccount = result;
            });

            $scope.isSaving = false;
            $scope.save = function (form) {

                if (form.$invalid) {
                    formService.setDirty(form);
                    return;
        }

                $scope.errors.asEnumerable().removeAll();

                $scope.isSaving = true;

                generalLedgerAccountApi.update(data.id, $scope.generalLedgerAccount).then(function (result) {
                    logger.success();
                    $modalInstance.close(result);
                }).catch(function (errors) {
                    $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.activate = function () {
                if ($scope.generalLedgerAccount.isActive) return;

                generalLedgerAccountApi.activate($scope.generalLedgerAccount.id).then(function () {
                    $scope.generalLedgerAccount.isActive = true;
                    logger.success();
                }).catch(function () {
                    $scope.errors = err.errors;
                });
            };

            $scope.deactivate = function () {
                if (!$scope.generalLedgerAccount.isActive) return;

                generalLedgerAccountApi.deactivate($scope.generalLedgerAccount.id).then(function () {
                    $scope.generalLedgerAccount.isActive = false;
                    logger.success();
                }).catch(function () {
                    $scope.errors = err.errors;
                });
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };

            $scope.accountPostingType = _constants2.default.enums.AccountPostingType();
            $scope.accountBalanceType = _constants2.default.enums.AccountBalanceType();
        }

        function generalLedgerAccountUpdateModalService(modalBase) {
            return modalBase({
                controller: generalLedgerAccountUpdateModalController,
                templateUrl: 'partials/modals/generalLedgerAccountUpdate.html'
            });
        }

        _acc2.default.controller('generalLedgerAccountUpdateModalController', generalLedgerAccountUpdateModalController).factory('generalLedgerAccountUpdateModalService', generalLedgerAccountUpdateModalService);

    }, {"../acc.module": 2, "../localData/config": 41, "../localData/constants": 42}],
    52: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalAttachImageController($scope, $modalInstance, data, journalApi) {

            var journalId = data.id;
            var errors = $scope.errors = [];

            $scope.uploaded = function (fileName) {
                journalApi.attachImage(journalId, {fileName: fileName}).then(function () {
                    return $modalInstance.close();
                }).catch(function (err) {
                    return errors = err;
                });
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };
        }

        function journalAttachImageService(modalBase) {
            return modalBase({
                controller: journalAttachImageController,
                templateUrl: 'partials/modals/journalAttachImage.html'
            });
        }

        _acc2.default.controller('journalAttachImageController', journalAttachImageController).factory('journalAttachImageService', journalAttachImageService);

    }, {"../acc.module": 2}],
    53: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalBookkeepingController($scope, $modalInstance, formService, data, journalApi) {

            var journalId = data.id;

            $scope.errors = [];
            $scope.bookkeeping = {
                number: null,
                date: ''
            };

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) return formService.setDirty(form);

                $scope.isSaving = true;

                journalApi.bookkeeping(journalId, $scope.bookkeeping).then(function (result) {
                    return $modalInstance.close();
                }).catch(function (errors) {
                    return $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };
        }

        function journalBookkeepingService(modalBase) {
            return modalBase({
                controller: journalBookkeepingController,
                templateUrl: 'partials/modals/journalBookkeeping.html'
            });
        }

        _acc2.default.controller('journalBookkeepingController', journalBookkeepingController).factory('journalBookkeepingService', journalBookkeepingService);

    }, {"../acc.module": 2}],
    54: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalCreateModalController($scope, $modalInstance, journalApi, logger) {

            $scope.errors = [];
            $scope.journal = {
                temporaryNumber: null,
                temporaryDate: null,
                description: ''
            };

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (form.$invalid) return;

                $scope.errors.asEnumerable().removeAll();

                $scope.isSaving = true;

                journalApi.create($scope.journal).then(function (result) {
                    logger.success();
                    $modalInstance.close(result);
                }).catch(function (errors) {
                    $scope.errors = errors;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };
        }

        function journalCreateModalControllerService(modalBase) {
            return modalBase({
                controller: journalCreateModalController,
                templateUrl: 'partials/modals/journalCreate.html'
            });
        }

        _acc2.default.controller('journalCreateModalController', journalCreateModalController).factory('journalCreateModalControllerService', journalCreateModalControllerService);

    }, {"../acc.module": 2}],
    55: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalLineCreateOrUpdateController($scope, $modalInstance, $timeout, formService, $q, journalLineApi, dimensionCategoryApi, logger, constants, data) {

            var journalId = data.journalId;
            var id = data.id;
            var editMode = $scope.editMode = id == undefined ? 'create' : 'update';

            $scope.generalLedgerAccountShouldBeFocus = true;

            $scope.errors = [];
            $scope.dimensionCategories = [];
            $scope.journalLine = {
                generalLedgerAccountId: null,
                subsidiaryLedgerAccountId: null,
                detailAccountId: null,
                dimension1Id: null,
                dimension2Id: null,
                dimension3Id: null,
                article: '',
                amount: null,
                balanceType: ''
            };

            $scope.detailAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.detailAccount.all()
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            $scope.dimension1DataSource = null;
            $scope.dimension2DataSource = null;
            $scope.dimension3DataSource = null;

            dimensionCategoryApi.getAll().then(function (result) {
                var cats = result.data;
                $scope.dimensionCategories = cats;

                $scope.dimension1DataSource = dimensionDataSourceFactory(cats[0].id);
                $scope.dimension2DataSource = dimensionDataSourceFactory(cats[1].id);
                $scope.dimension3DataSource = dimensionDataSourceFactory(cats[2].id);
            });

            if (editMode == 'update') journalLineApi.getById(id).then(function (result) {
                result.amount = 0;
                result.balanceType = '';

                if (result.creditor > 0) {
                    result.amount = result.creditor;
                    result.balanceType = 'creditor';
                }

                if (result.debtor > 0) {
                    result.amount = result.debtor;
                    result.balanceType = 'debtor';
                }

                $scope.journalLine = result;
            });

            var resetForm = function resetForm(form) {

                $scope.journalLine = {
                    generalLedgerAccountId: null,
                    subsidiaryLedgerAccount: null,
                    detailAccountId: null,
                    description: '',
                    amount: null,
                    balanceType: ''
                };

                $timeout(function () {
                    return formService.setClean(form);
                }, 100);

                $scope.generalLedgerAccountShouldBeFocus = true;
            };

            $scope.isSaving = false;

            var save = function save(form) {
                var deferred = $q.defer();

                function execute() {
                    if (form.$invalid) {
                        formService.setDirty(form);
                        deferred.reject();
                        return;
                    }

                    $scope.isSaving = true;

                    if (editMode == 'create') journalLineApi.create(journalId, $scope.journalLine).then(function (result) {
                        deferred.resolve(result);
                        logger.success();
                    }).catch(function (errors) {
                        $scope.errors = errors;
                        deferred.reject();
                    }).finally(function () {
                        $scope.isSaving = false;
                        deferred.resolve();
                    });

                    if (editMode == 'update') journalLineApi.update(id, $scope.journalLine).then(function () {
                        deferred.resolve();
                        logger.success();
                    }).catch(function (errors) {
                        $scope.errors = errors;
                        deferred.reject();
                    }).finally(function () {
                        return $scope.isSaving = false;
                    });
                }

                $timeout(execute, 0);

                return deferred.promise;
            };

            $scope.saveAndNew = function (form) {
                save(form).then(function () {
                    return resetForm(form);
                });
            };

            $scope.saveAndReturn = function (form) {
                save(form).then(function (result) {
                    return $modalInstance.close(result);
                });
            };

            $scope.generalLedgerAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.generalLedgerAccount.all()
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            $scope.generalLedgerAccountOnChange = function () {
                $scope.journalLine.subsidiaryLedgerAccountId = null;

                $scope.journalLine.detailAccount = {
                    canShow: false,
                    isRequired: false
                };
                $scope.journalLine.dimension1 = {
                    canShow: false,
                    isRequired: false
                };
                $scope.journalLine.dimension2 = {
                    canShow: false,
                    isRequired: false
                };
                $scope.journalLine.dimension3 = {
                    canShow: false,
                    isRequired: false
                };
                $scope.journalLine.detailAccount = {
                    canShow: false,
                    isRequired: false
                };
            };

            $scope.subsidiaryLedgerAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: function url(filter) {
                            var generalLegerAccountId = filter.filter.filters.asEnumerable().first(function (f) {
                                return f.field == 'generalLedgerAccountId';
                            }).value;

                            return constants.urls.subsidiaryLedgerAccount.allByGeneralLedgerAccount(generalLegerAccountId);
                }
                    }
                },
                schema: {
                    data: 'data'
                }
            };

            $scope.subsidiaryLedgerAccountSelect = function (e) {
                var item = e.sender.dataItem();

                if (!item) {
                    $scope.journalLine.detailAccount = {
                        canShow: false,
                        isRequired: false
                    };
                    $scope.journalLine.dimension1 = {
                        canShow: false,
                        isRequired: false
                    };
                    $scope.journalLine.dimension2 = {
                        canShow: false,
                        isRequired: false
                    };
                    $scope.journalLine.dimension3 = {
                        canShow: false,
                        isRequired: false
                    };

                    return;
                }

                $scope.journalLine.detailAccount = {
                    canShow: ['Required', 'NotRequired'].asEnumerable().contains(item.detailAccountAssignmentStatus),
                    isRequired: item.detailAccountAssignmentStatus == 'Required'
                };

                $scope.journalLine.dimension1 = {
                    canShow: ['Required', 'NotRequired'].asEnumerable().contains(item.dimension1AssignmentStatus),
                    isRequired: item.dimension1AssignmentStatus == 'Required'
                };

                $scope.journalLine.dimension2 = {
                    canShow: ['Required', 'NotRequired'].asEnumerable().contains(item.dimension2AssignmentStatus),
                    isRequired: item.dimension2AssignmentStatus == 'Required'
                };

                $scope.journalLine.dimension3 = {
                    canShow: ['Required', 'NotRequired'].asEnumerable().contains(item.dimension3AssignmentStatus),
                    isRequired: item.dimension3AssignmentStatus == 'Required'
                };
            };

            $scope.subsidiaryLedgerAccountDataBound = function (e) {
                return e.sender.trigger('change');
            };

            $scope.detailAccountDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.detailAccount.all()
                    }
                },
                schema: {
                    data: 'data'
        }
            };

            var dimensionDataSourceFactory = function dimensionDataSourceFactory(categoryId) {
                return {
                    type: "json",
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: constants.urls.dimension.allByCategory(categoryId)
                        }
                    },
                    schema: {
                        data: 'data'
                    }
                };
            };

            $scope.changeAmountBalance = function () {
                return $scope.journalLine.balanceType = $scope.journalLine.balanceType == 'debtor' ? 'creditor' : 'debtor';
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };
        }

        function journalLineCreateOrUpdateControllerModalService(modalBase) {
            return modalBase({
                controller: journalLineCreateOrUpdateController,
                templateUrl: 'partials/modals/journalLineCreateOrUpdate.html'
            });
        }

        _acc2.default.controller('journalLineCreateController', journalLineCreateOrUpdateController).factory('journalLineCreateControllerModalService', journalLineCreateOrUpdateControllerModalService);

        _acc2.default.controller('journalLineUpdateController', journalLineCreateOrUpdateController).factory('journalLineUpdateControllerModalService', journalLineCreateOrUpdateControllerModalService);

    }, {"../acc.module": 2}],
    56: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function formService() {

            function setDirty(form) {
                angular.forEach(form.$error, function (type) {
                    angular.forEach(type, function (field) {
                        field.$setDirty();
                    });
                });
                return form;
            }

            function setClean(form) {
                angular.forEach(form.$error, function (type) {
                    angular.forEach(type, function (field) {
                        field.$setPristine();
                    });
                });
            }

            return {
                setDirty: setDirty,
                setClean: setClean
            };
        }

        _acc2.default.service('formService', formService);

    }, {"../acc.module": 2}],
    57: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function translateStorageService() {

            return {
                put: function put(name, value) {
                    localStorage.setItem('translate.{0}'.format(name), value);
                },
                get: function get(name) {
                    return localStorage.getItem('translate.{0}'.format(name));
        }
            };
        }

        _acc2.default.factory('translateStorageService', translateStorageService);

    }, {"../acc.module": 2}]
}, {}, [1])
//# sourceMappingURL=acc.bundle.js.map
