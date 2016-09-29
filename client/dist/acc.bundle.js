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

        require('./controllers/chequeCategoriesController');

        require('./controllers/banksController');

        require('./controllers/journalManagementController');

        require('./controllers/journalCopy');

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

        require('./modals/writeChequeOnJournalLineEntry');

        require('./modals/showJournalDetail');

        require('./localData/constants');

        require('./directives/alert');

        require('./directives/subContent');

        require('./directives/blockUi');

        require('./directives/customValidator');

        require('./directives/validationSummary');

        require('./directives/focusMe');

        require('./directives/uploader');

        require('./directives/button');

        require('./directives/combobox');

        require('./directives/content');

        require('./directives/datepicker');

        require('./directives/dropdownlist');

        require('./directives/grid');

        require('./directives/layout');

        require('./directives/numeric');

        require('./directives/textEditor');

        require('./directives/checkbox');

        require('./filters/amount');

        require('./services/formService');

        require('./services/translateStorageService');

        require('./services/apiPromise');

        require('./services/confirm');

        require('./services/gridFilterCellTypeProvider');

        require('./services/logger');

        require('./services/menuItemsProvider');

        require('./services/modalBase');

        require('./services/routeNavigatorService');

        require('./services/translate');

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
        "./controllers/journalCopy": 25,
        "./controllers/journalManagementController": 26,
        "./controllers/journalUpdateController": 27,
        "./controllers/journalsController": 28,
        "./controllers/shellController": 29,
        "./controllers/subsidiaryLedgerAccountCreateController": 30,
        "./controllers/subsidiaryLedgerAccountUpdateController": 31,
        "./controllers/subsidiaryLedgerAccountsController": 32,
        "./directives/alert": 33,
        "./directives/blockUi": 34,
        "./directives/button": 35,
        "./directives/checkbox": 36,
        "./directives/combobox": 37,
        "./directives/content": 38,
        "./directives/customValidator": 39,
        "./directives/datepicker": 40,
        "./directives/dropdownlist": 41,
        "./directives/focusMe": 42,
        "./directives/grid": 43,
        "./directives/layout": 44,
        "./directives/numeric": 45,
        "./directives/subContent": 46,
        "./directives/textEditor": 47,
        "./directives/uploader": 48,
        "./directives/validationSummary": 49,
        "./filters/amount": 50,
        "./localData/constants": 52,
        "./modals/chequeCategroyCreate": 56,
        "./modals/chequeCategroyUpdate": 57,
        "./modals/dimensionCreate": 58,
        "./modals/dimensionUpdate": 59,
        "./modals/generalLedgerAccountCreate": 60,
        "./modals/generalLedgerAccountUpdate": 61,
        "./modals/journalAttachImage": 62,
        "./modals/journalBookkeeping": 63,
        "./modals/journalCreate": 64,
        "./modals/journalLineCreateOrUpdate": 65,
        "./modals/showJournalDetail": 66,
        "./modals/writeChequeOnJournalLineEntry": 67,
        "./services/apiPromise": 68,
        "./services/confirm": 69,
        "./services/formService": 70,
        "./services/gridFilterCellTypeProvider": 71,
        "./services/logger": 72,
        "./services/menuItemsProvider": 73,
        "./services/modalBase": 74,
        "./services/routeNavigatorService": 75,
        "./services/translate": 76,
        "./services/translateStorageService": 77
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

        require('angular-cookies');

        require('kendo');

        require('kendo.messages');

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        var accModule = _angular2.default.module('acc.module', ['ngAnimate', 'ngRoute', 'ngResource', 'ngSanitize', 'ui.bootstrap', 'pascalprecht.translate', 'kendo.directives', 'ngMessages', 'ngCookies']);

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
        "angular-cookies": "angular-cookies",
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
                },
                write: function write(id, data) {
                    return apiPromise.put('{0}/cheques/{1}/write'.format(urlPrefix, id), data);
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
                getOpens: function getOpens(detailAccountId) {
                    return apiPromise.get('{0}/cheque-categories/detail-account/{1}/opens'.format(urlPrefix, detailAccountId));
                },
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
                copy: function copy(id) {
                    return apiPromise.post('{0}/journals/{1}/copy'.format(urlPrefix, id));
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

    }, {"../acc.module": 2, "../localData/constants": 52}],
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
                    title: 'مدیریت اسناد',
                    url: '#/journal-management',
                    icon: ''
                }, {
                    title: 'کپی سند',
                    url: '#/journal/copy',
                    icon: 'glyphicon glyphicon-copy'
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
            }).when('/journal/copy', {
                controller: 'journalCopyController',
                templateUrl: 'partials/views/journalCopy.html'
            }).when('/journal/:id/edit', {
                controller: 'journalUpdateController',
                templateUrl: 'partials/views/journalUpdate.html'
            }).when('/journal-management', {
                controller: 'journalManagementController',
                templateUrl: 'partials/views/journalManagement.html'
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

    }, {"../acc.module": 2, "../localData/config": 51, "angular-translate-loader-url": "angular-translate-loader-url"}],
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

        function homeController($scope, $timeout, $route, $rootScope, constants, logger, $cookies) {
            $scope.current = {
                fiscalPeriod: parseInt($cookies.get('current-period'))
            };

            $scope.fiscalPeriodDataBound = function (e) {
                var item = e.sender.dataItem();
                $rootScope.$emit('currentPeriodChanged', item.display);
            };

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
                $cookies.put('current-period', item.id);
                $rootScope.$emit('currentPeriodChanged', item.display);
            };
        }

        _acc2.default.controller('homeController', homeController);

    }, {"../acc.module": 2}],
    25: [function (require, module, exports) {
        "use strict";

        var _acc = require("../acc.module");

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalCopyController($scope, translate, journalApi, navigate, constants, $timeout, confirm) {
            "use strict";

            $scope.errors = [];

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

                $scope.canShowJournalGrid = false;
                $scope.gridOption.readUrl = constants.urls.journal.getAllByPeriod(item.id);

                $timeout(function () {
                    return $scope.canShowJournalGrid = true;
                }, 0);
            };

            $scope.gridOption = {
                columns: [{
                    name: 'temporaryNumber',
                    title: translate('Temporary number'),
                    width: '20%',
                    type: 'number'
                }, {name: 'temporaryDate', title: translate('Temporary date'), type: 'date', width: '20%'}, {
                    name: 'description', title: translate('Description'), type: 'string', width: '50%',
                    template: '<span title="${data.description}">${data.description}</span>'
                }],
                commands: [],
                selectable: true,
                current: null
            };

            $scope.canShowJournalGrid = false;

            $scope.isSaving = false;

            $scope.submit = function (current) {

                confirm(translate('Are you sure ?'), translate('Copy journal')).then(function () {
                    $scope.isSaving = true;

                    journalApi.copy(current.id).then(function (result) {
                        confirm(translate('Do you want to edit created journal ?'), translate('Successful'), 'success').then(function () {
                            navigate('journalUpdate', {id: result.id});
                });
                    }).finally(function () {
                        return $scope.isSaving = false;
                    });
                });
            };

            $scope.editCreatedJournal = function () {
                navigate('journalUpdate', {id: $scope.model.createdJournalId});
            };
        }

        _acc2.default.controller('journalCopyController', journalCopyController);

    }, {"../acc.module": 2}],
    26: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalManagementController($scope, logger, confirm, constants, translate, $timeout, showJournalDetailModalService, journalBookkeepingService) {
            $scope.gridOption = {
                columns: [{name: 'monthName', title: translate('Month'), type: 'string'}, {
                    name: 'count',
                    title: translate('Count'),
                    type: 'string'
                }, {name: 'minNumber', title: translate('From number'), type: 'string'}, {
                    name: 'maxNumber',
                    title: translate('To number'),
                    type: 'string'
                }, {name: 'minDate', title: translate('From date'), type: 'string'}, {
                    name: 'maxDate',
                    title: translate('To date'),
                    type: 'string'
                }],
                commands: [],
                readUrl: constants.urls.journal.getGroupedByMouth(),
                current: null,
                selectable: true,
                filterable: false,
                pageable: false
            };

            $scope.canShowJournals = false;

            $scope.journalGridOption = {
                columns: [{
                    name: 'temporaryNumber',
                    title: translate('Temporary number'),
                    type: 'number',
                    width: '10%'
                }, {
                    name: 'temporaryDate',
                    title: translate('Temporary date'),
                    type: 'date',
                    width: '10%'
                }, {name: 'number', title: translate('Number'), type: 'number', width: '10%'}, {
                    name: 'date',
                    title: translate('Date'),
                    type: 'date',
                    width: '10%'
                }, {
                    name: 'isFixed', title: translate('Fixed ?'), type: 'boolean', width: '10%',
                    template: '<i class="glyphicon glyphicon-${data.isFixed ? "ok-circle" : "remove-circle"}"' + 'style="font-size: 20px;">' + '</i>'
                }, {name: 'sumAmount', title: translate('Amount'), type: 'number', width: '10%', format: '{0:#,##}'}, {
                    name: 'hasAttachment', title: translate('Attachment ?'), type: 'boolean', width: '10%',
                    template: '<i class="glyphicon glyphicon-${data.hasAttachment ? "ok-circle" : "remove-circle"}"' + 'style="font-size: 20px;">' + '</i>'
                }, {name: 'countOfRows', title: translate('Rows'), type: 'number', width: '10%'}, {
                    name: 'description', title: translate('Description'), type: 'string', width: '20%',
                    template: '<span title="${data.description}">${data.description}</span>'
                }],
                commands: [],
                selectable: true,
                current: null
                //readUrl: constants.urls.journal.getByMonth()
            };

            $scope.$watch('gridOption.current', function (newValue) {
                if (!newValue) return;
                $scope.canShowJournals = false;
                $scope.journalGridOption.readUrl = constants.urls.journal.getByMonth(newValue.month);
                $timeout(function () {
                    return $scope.canShowJournals = true;
                }, 0);
            });

            $scope.bookkeeping = function (current) {
                if (current.number) return logger.error(translate('This journal already bookkeeped'));

                journalBookkeepingService.show({id: current.id}).then(function () {
                    logger.success();
                    $scope.journalGridOption.refresh();
                });
            };

            $scope.showJournal = function (current) {
                showJournalDetailModalService.show({
                    id: current.id
                });
            };
        }

        _acc2.default.controller('journalManagementController', journalManagementController);

    }, {"../acc.module": 2}],
    27: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function journalUpdateController($scope, logger, confirm, translate, navigate, $routeParams, $rootScope, journalApi, journalLineApi, subsidiaryLedgerAccountApi, journalLineCreateControllerModalService, journalLineUpdateControllerModalService, journalBookkeepingService, journalAttachImageService, writeChequeOnJournalLineEntryService) {

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

            $scope.writeCheque = function () {
                $rootScope.blockUi.block();

                var current = $scope.gridOption.current;
                subsidiaryLedgerAccountApi.getById(current.subsidiaryLedgerAccountId).then(function (result) {
                    $rootScope.blockUi.unBlock();

                    if (result.isBankAccount) {
                        writeChequeOnJournalLineEntryService.show({
                            journalLineId: current.id,
                            detailAccountId: current.detailAccountId,
                            detailAccountDisplay: current.detailAccountDisplay,
                            amount: current.creditor,
                            description: current.article,
                            date: $scope.journal.date
                        }).then(function () {
                            $scope.gridOption.refresh();
                    logger.success();
                });
                    } else {
                        logger.error(translate('The current subsidiaryLedgerAccount is not bank account'));
                    }
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

        function button() {
            return {
                restrict: 'E',
                templateUrl: 'partials/templates/button-template.html',
                replace: true,
                scope: {
                    isWaiting: '=',
                    icon: '@',
                    styleType: '@',
                    title: '@'
                },
                link: function link(scope, element, attrs) {
                }
            };
        }

        _acc2.default.directive('devTagButton', button);

    }, {"../acc.module": 2}],
    36: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function checkBox() {
            return {
                require: 'ngModel',
                restrict: 'E',
                templateUrl: 'partials/templates/checkbox-template.html',
                replace: true,
                scope: {
                    ngModel: '=',
                    title: '@'
                },
                link: function link(scope, element, attrs) {
                    scope.change = function () {
                        scope.ngModel = !scope.ngModel;
            };
        }
            };
        }

        _acc2.default.directive('devTagCheckBox', checkBox);

    }, {"../acc.module": 2}],
    37: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function combobox() {
            return {
                restrict: 'E',
                replace: true,
                template: '<input kendo-combo-box />',
                link: function link(scope, element, attrs) {
                }
            };
        }

        _acc2.default.directive('devTagComboBox', combobox);

    }, {"../acc.module": 2}],
    38: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function content() {
            return {
                restrict: 'E',
                templateUrl: 'partials/templates/content-template.html',
                transclude: true,
                scope: {},
                link: function link(scope, element, attrs) {
                    scope.title = attrs.title;
        }
            };
        }

        _acc2.default.directive('devTagContent', content);

    }, {"../acc.module": 2}],
    39: [function (require, module, exports) {
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
    40: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function datepicker() {
            return {
                restrict: 'E',
                template: '<input kendo-date-picker style="width: 100%;" />',
                replace: true,
                link: function link(scope, element, attrs) {
                }
            };
        }

        _acc2.default.directive('devTagDatepicker', datepicker);

    }, {"../acc.module": 2}],
    41: [function (require, module, exports) {
        'use strict';

        var _jquery = require('jquery');

        var _jquery2 = _interopRequireDefault(_jquery);

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function dropdownlist() {
            return {
                restrict: 'E',
                require: 'ngModel',
                template: '<select></select>',
                replace: true,
                scope: {
                    dataTextField: '@kDataTextField',
                    dataValueField: '@kDataValueField',
                    optionLabel: '@kOptionLabel',
                    dataSource: '=kDataSource',
                    onChange: '&kOnChange'
                },
                link: function link(scope, element, attrs, ngModel) {
                    var dropdown = (0, _jquery2.default)(element).kendoDropDownList({
                        optionLabel: scope.optionLabel,
                        dataTextField: scope.dataTextField,
                        dataValueField: scope.dataValueField,
                        dataSource: scope.dataSource,
                        change: function change(e) {
                            var item = e.sender.dataItem();

                            scope.$apply(function () {
                                return ngModel.$setViewValue(item[scope.dataValueField]);
                            });
                            if (scope.onChange) scope.onChange({selectedItem: item});
                        }
                    }).data('kendoDropDownList');

                    ngModel.$render = function () {
                        return dropdown.value(ngModel.$modelValue);
            };
        }
            };
        }

        _acc2.default.directive('devTagDropdownlist', dropdownlist);

    }, {"../acc.module": 2, "jquery": "jquery"}],
    42: [function (require, module, exports) {
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
    43: [function (require, module, exports) {
        'use strict';

        var _jquery = require('jquery');

        var _jquery2 = _interopRequireDefault(_jquery);

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function grid(gridFilterCellType, $compile) {
            return {
                restrict: 'E',
                transclude: true,
                template: '<div>' + '<div ng-transclude style="display: none"></div>' + '</div>',
                scope: {
                    kOption: '=',
                    kDatasource: '=',
                    option: '=',
                    detailOption: '='
                },
                link: function link(scope, element, attrs) {

                    var grid = {};

                    if (scope.kOption) {
                        grid = (0, _jquery2.default)(element).kendoGrid(scope.kOption).data("kendoGrid");
                    } else {
                        var option = createKendoGridOption(scope, scope.option);

                        if (scope.detailOption) {
                            var detailOption = createKendoGridOption(scope, scope.detailOption);

                            option.detailTemplate = kendo.template('<div class="detail-template"></div>');
                            option.detailInit = function (e) {
                                var detailRow = e.detailRow;
                                var parent = e.data;

                                if (scope.detailOption.url) {
                                    var url = scope.detailOption.url(e.data);
                                    detailOption.dataSource = new kendo.data.DataSource({
                                        transport: {
                                            read: {
                                                url: url,
                                                dataType: "json",
                                                contentType: 'application/json; charset=utf-8',
                                                type: 'GET'
                                            }
                                        },
                                        schema: {
                                            data: "data",
                                            total: "total"
                                            //model: model
                                        },
                                        pageSize: option.pageSize || 20,
                                        serverPaging: true,
                                        serverFiltering: true,
                                        serverSorting: true
                                    });
                                }

                                detailRow.find('.detail-template').kendoGrid(detailOption);

                                parent.refreshDetail = function () {
                                    detailOption.dataSource.read();
                                };
                            };
                        }

                        var grid = (0, _jquery2.default)(element).kendoGrid(option).data("kendoGrid");

                        if (option.commandTemplate) option.commandTemplate.commands.forEach(function (cmd) {
                            (0, _jquery2.default)(element).on("click", cmd.selector, function (e) {
                                var dataItem = grid.dataItem((0, _jquery2.default)(e.currentTarget).closest("tr"));
                                cmd.action(dataItem);
                                scope.$apply();
                    });
                });
                    }

                    if (scope.option) {
                        scope.option.grid = grid;

                        scope.option.refresh = function () {
                            grid.dataSource.read();
                        };
                    }

                    function createKendoGridOption(scope, option) {

                        var aggregatesForDateSource = [];

                        function setAggregatesForDataSource(column) {
                            var aggregates = column.aggregates;

                            if (!aggregates) return;

                            if (aggregates.length == 0) return;

                            var aggregatesForThisColumn = aggregates.asEnumerable().select(function (agg) {
                                return {
                                    field: column.name,
                                    aggregate: agg
                                };
                            }).toArray();

                            aggregatesForDateSource = aggregatesForDateSource.asEnumerable().concat(aggregatesForThisColumn).toArray();
                        }

                        var cols = option.columns.asEnumerable().select(function (col) {
                            setAggregatesForDataSource(col);

                            return {
                                field: col.name,
                                title: col.title,
                                width: col.width,
                                format: col.format,
                                template: col.template,
                                aggregates: col.aggregates,
                                footerTemplate: col.footerTemplate,
                                filterable: getFilterable(col.type)
                            };
                        }).toArray();

                        var model = {fields: {}};
                        option.columns.forEach(function (col) {
                            model.fields[col.name] = {type: gridFilterCellType[col.type].modelType};
                });

                        var commands = option.commands.asEnumerable().select(function (cmd) {
                            if (typeof cmd == "string") return cmd;

                            return {
                                text: cmd.title,
                                imageClass: cmd.imageClass,
                                click: function click(e) {
                                    e.preventDefault();

                                    var dataItem = this.dataItem((0, _jquery2.default)(e.currentTarget).closest("tr"));
                                    cmd.action(dataItem);

                                    scope.$apply();
                                }
                            };
                        }).toArray();

                        if (option.commandTemplate) cols.push({template: kendo.template((0, _jquery2.default)(option.commandTemplate.template).html())});

                        cols.push({command: commands});

                        var filterable = option.filterable == undefined || option.filterable == true ? {
                            mode: 'row',
                            operators: {
                                string: {contains: 'Contains'},
                                number: {
                                    eq: 'Equal to',
                                    gte: "Greater than or equal to",
                                    gt: "Greater than",
                                    lte: "Less than or equal to",
                                    lt: "Less than"
                                },
                                date: {
                                    gt: "After",
                                    lt: "Before",
                                    eq: "Equal"
                                }
                            }
                        } : false;

                        var kendGridOption = {
                            dataSource: scope.kDatasource ? scope.kDatasource : new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: option.readUrl,
                                        dataType: "json",
                                        contentType: 'application/json; charset=utf-8',
                                        type: 'GET'
                                    },
                                    parameterMap: function parameterMap(options) {
                                        return options;
                            }
                                },
                                schema: {
                                    data: "data",
                                    total: "total",
                                    model: model,
                                    aggregates: "aggregates"
                                },
                                serverAggregates: true,
                                aggregate: aggregatesForDateSource,
                                pageSize: option.pageSize || 20,
                                serverPaging: true,
                                serverFiltering: true,
                                serverSorting: true
                            }),
                            filterable: filterable,
                            pageable: option.pageable == undefined ? {
                                refresh: true,
                                pageSizes: true,
                                buttonCount: 5
                            } : option.pageable,
                            sortable: true,
                            columns: cols,
                            selectable: option.selectable,
                            editable: option.editable,
                            resizable: true,
                            change: function change() {
                                var current = this.dataItem(this.select());

                                option.current = current;

                                scope.$apply();
                    }
                        };

                        if (option.toolbar) scope.options.toolbar = kendo.template(scope.toolbar);

                        return kendGridOption;
                    }

                    function getFilterable(type) {
                        var filterable = {};
                        var cell = gridFilterCellType[type];

                        if (cell.hasOwnProperty('cell')) cell = cell.cell;

                        filterable.cell = cell;

                        return filterable;
                    }
        }
            };
        }

        _acc2.default.directive('devTagGrid', grid);

    }, {"../acc.module": 2, "jquery": "jquery"}],
    44: [function (require, module, exports) {
        'use strict';

        var _jquery = require('jquery');

        var _jquery2 = _interopRequireDefault(_jquery);

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function header($rootScope) {
            return {
                restrict: 'E',
                templateUrl: 'partials/templates/header-template.html',
                replace: true,
                scope: {},
                link: function link(scope, element, attrs) {
                    scope.currentUser = localStorage.getItem('currentUser');
                    scope.currentPeriod = {
                        display: ''
            };

                    $rootScope.$on('currentPeriodChanged', function (e, currentPeriodDisplay) {
                        scope.currentPeriod.display = currentPeriodDisplay;
                    });

                    (0, _jquery2.default)(element).find('.dropdown');
                    (0, _jquery2.default)('input').click(function () {
                        (0, _jquery2.default)('.dropdown').addClass('open');
                        (0, _jquery2.default)('.dropdown').addClass('test-class');
                    });
        }
            };
        }

        function togglemenu() {
            return {
                restrict: 'E',
                templateUrl: 'partials/templates/togglemenu-template.html',
                replace: true,
                scope: {
                    menuitems: '=',
                    toggleobservable: '='
                },
                transclude: true,
                link: function link(scope, element, attrs) {
                    (0, _jquery2.default)("#menu-toggle").click(function (e) {
                        e.preventDefault();
                        (0, _jquery2.default)("#wrapper").toggleClass("toggled");
                    });

                    createMenu(scope.menuitems, element);
        }
            };
        }

        function createMenu(menuItems, element) {
            menuItems.forEach(function (item) {
                var $el = (0, _jquery2.default)(element).find('.gw-nav');
                var icon = item.icon || 'file';

                var li = (0, _jquery2.default)('<li class="init-arrow-down"></li>');
                li.append('<a href="{0}"></a>'.format(item.url));
                li.find('a').append('<span class="webfont-menu" aria-hidden="true">' + '<span class="glyphicon glyphicon-{0}"></span>'.format(icon) + '</span>'.format(icon));

                li.find('a').append('<span class="gw=menu-text">{0}</span>'.format(item.title));

                if (item.children.length > 0) {
                    li.find('a').append('<b class="gw-arrow icon-arrow-up8"></b>');
                    li.append('<ul class="gw-submenu"></ul>');

                    item.children.forEach(function (child) {
                        var liChild = (0, _jquery2.default)('<li></li>');
                        var icon = child.icon || 'file';

                        liChild.append('<a href="{0}"></a>'.format(child.url));
                        /* liChild.find('a')
                         .append('<span class="webfont-submenu glyphicon glyphicon-{0}"></span>'
                         .format(icon));*/

                        liChild.find('a').append(child.title);

                        li.find('ul').append(liChild);
                    });
        }
                ;

                $el.append(li);
            });

            menuCreateExpandAndActiveBehavior((0, _jquery2.default)(element));
        }

        function menuCreateExpandAndActiveBehavior($element) {
            var $ele = function $ele(selector) {
                return $element.find(selector);
            };

            $ele('.gw-nav > li > a').click(function (e) {
                var hrefAttr = (0, _jquery2.default)(this).attr('href');
                if (hrefAttr == undefined || hrefAttr == null || hrefAttr == '') e.preventDefault();

                var gw_nav = $ele('.gw-nav');
                gw_nav.find('li').removeClass('active');
                $ele('.gw-nav > li > ul > li').removeClass('active');

                var checkElement = (0, _jquery2.default)(this).parent();
                var ulDom = checkElement.find('.gw-submenu')[0];

                if (ulDom == undefined) {
                    checkElement.addClass('active');
                    $ele('.gw-nav').find('li').find('ul:visible').slideUp();
                    return;
        }
                if (ulDom.style.display != 'block') {
                    gw_nav.find('li').find('ul:visible').slideUp();
                    gw_nav.find('li.init-arrow-up').removeClass('init-arrow-up').addClass('arrow-down');
                    gw_nav.find('li.arrow-up').removeClass('arrow-up').addClass('arrow-down');
                    checkElement.removeClass('init-arrow-down');
                    checkElement.removeClass('arrow-down');
                    checkElement.addClass('arrow-up');
                    checkElement.addClass('active');
                    checkElement.find('ul').slideDown(300);
                } else {
                    checkElement.removeClass('init-arrow-up');
                    checkElement.removeClass('arrow-up');
                    checkElement.removeClass('active');
                    checkElement.addClass('arrow-down');
                    checkElement.find('ul').slideUp(300);
        }
            });
            (0, _jquery2.default)('.gw-nav > li > ul > li > a').click(function () {
                $ele(this).parent().parent().removeClass('active');
                $ele('.gw-nav > li > ul > li').removeClass('active');
                (0, _jquery2.default)(this).parent().addClass('active');
            });
        };

        _acc2.default.directive('devTagHeader', header).directive('devTagTogglemenu', togglemenu);

    }, {"../acc.module": 2, "jquery": "jquery"}],
    45: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function numeric() {
            return {
                restrict: 'E',
                template: '<input type="number" class="form-control" /> ',
                replace: true
            };
        }

        _acc2.default.directive('devTagNumeric', numeric);

    }, {"../acc.module": 2}],
    46: [function (require, module, exports) {
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
    47: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function textEditor() {
            return {
                restrict: 'E',
                replace: true,
                template: '<textarea kendo-editor k-ng-model="ngModel"></textarea>',
                link: function link(scope, element, attrs) {
                }
            };
        }

        _acc2.default.directive('devTagEditor', textEditor);

    }, {"../acc.module": 2}],
    48: [function (require, module, exports) {
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
    49: [function (require, module, exports) {
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
    50: [function (require, module, exports) {
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
    51: [function (require, module, exports) {
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
    52: [function (require, module, exports) {
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

    }, {"../acc.module": 2, "./config": 51, "./enums": 54, "./urls": 55}],
    53: [function (require, module, exports) {
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
    54: [function (require, module, exports) {
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

    }, {"./enumType": 53}],
    55: [function (require, module, exports) {
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
                return '{0}/fiscal-periods'.format(rootUrl());
            }
        };

        var chequeCategory = {
            all: function all() {
                return '{0}/cheque-categories'.format(rootUrl());
            },
            allOpens: function allOpens(detailAccountId) {
                return '{0}/cheque-categories/detail-account/{1}/opens'.format(rootUrl(), detailAccountId);
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
            allwhites: function allwhites(categoryId) {
                return '{0}/cheques/category/{1}/whites'.format(rootUrl(), categoryId);
            }
        };

        var journal = {
            getGroupedByMouth: function getGroupedByMouth() {
                return '{0}/journals/summary/grouped-by-month'.format(rootUrl());
            },
            getByMonth: function getByMonth(month) {
                return '{0}/journals/month/{1}'.format(rootUrl(), month);
            },
            getAllByPeriod: function getAllByPeriod(periodId) {
                return '{0}/journals/period/{1}'.format(rootUrl(), periodId);
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
            cheque: cheque,
            journal: journal
        };

        exports.default = apiUrls;

    }, {}],
    56: [function (require, module, exports) {
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
    57: [function (require, module, exports) {
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
    58: [function (require, module, exports) {
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

    }, {"../acc.module": 2, "../localData/config": 51}],
    59: [function (require, module, exports) {
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
    60: [function (require, module, exports) {
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

    }, {"../acc.module": 2, "../localData/constants": 52}],
    61: [function (require, module, exports) {
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

    }, {"../acc.module": 2, "../localData/config": 51, "../localData/constants": 52}],
    62: [function (require, module, exports) {
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
    63: [function (require, module, exports) {
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
    64: [function (require, module, exports) {
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
    65: [function (require, module, exports) {
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
    66: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function showJournalDetailController($scope, translate, $modalInstance, journalApi, journalLineApi, data) {
            "use strict";

            var id = data.id;
            $scope.journal = {};

            function fetch() {
                journalApi.getById(id).then(function (result) {
                    return $scope.journal = result;
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
                }, {
                    name: 'article', title: translate('Article'), width: '200px', type: 'string',
                    template: '<span title="${data.article}">${data.article}</span>'
                }, {
                    name: 'debtor', title: translate('Debtor'), width: '120px', type: 'number', format: '{0:#,##}',
                    aggregates: ['sum'], footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
                }, {
                    name: 'creditor', title: translate('Creditor'), width: '120px', type: 'number', format: '{0:#,##}',
                    aggregates: ['sum'], footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
                }],
                commands: [],

                readUrl: journalLineApi.url.getAll(id)
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };
        }

        function showJournalDetailModalService(modalBase) {
            return modalBase({
                controller: showJournalDetailController,
                templateUrl: 'partials/modals/showJournalDetail.html',
                size: 'lg'
            });
        }

        _acc2.default.controller('showJournalDetailController', showJournalDetailController).factory('showJournalDetailModalService', showJournalDetailModalService);

    }, {"../acc.module": 2}],
    67: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function writeChequeOnJournalLineEntryController($scope, chequeApi, chequeCategoryApi, data, $timeout, formService, $modalInstance, constants) {
            $scope.errors = [];
            $scope.cheque = {
                journalLineId: data.journalLineId,
                detailAccountDisplay: data.detailAccountDisplay,
                chequeId: null,
                amount: data.amount,
                date: data.date,
                description: data.description
            };

            $scope.openChequeCategories = [];
            $scope.selectedChequeCategory = false;
            $scope.hasOpenChequeCategories = true;

            chequeCategoryApi.getOpens(data.detailAccountId).then(function (result) {
                $scope.openChequeCategories = result;
                if (result.length == 0) $scope.hasOpenChequeCategories = false;
            });

            $scope.selectChequeCategory = function (cat) {
                $scope.selectedChequeCategory = false;
                $scope.whiteChequesDataSource.transport.read.url = constants.urls.cheque.allwhites(cat.id);

                $timeout(function () {
                    return $scope.selectedChequeCategory = cat;
                }, 1);
            };

            $scope.isSaving = false;

            $scope.save = function (form) {
                if (!$scope.hasOpenChequeCategories) return;
                if (form.$invalid) return formService.setDirty(form);

                $scope.isSaving = true;
                chequeApi.write($scope.cheque.chequeId, $scope.cheque).then(function (result) {
                    return $modalInstance.close(result);
                }).catch(function (result) {
                    return $scope.errors = result;
                }).finally(function () {
                    return $scope.isSaving = false;
                });
            };

            $scope.close = function () {
                return $modalInstance.dismiss();
            };

            $scope.whiteChequesDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: null
                    }
                },
                schema: {
                    data: 'data'
        }
            };
        }

        function writeChequeOnJournalLineEntryService(modalBase) {
            return modalBase({
                controller: writeChequeOnJournalLineEntryController,
                templateUrl: 'partials/modals/writeChequeOnJournalLineEntry.html'
            });
        }

        _acc2.default.controller('writeChequeOnJournalLineEntryController', writeChequeOnJournalLineEntryController).factory('writeChequeOnJournalLineEntryService', writeChequeOnJournalLineEntryService);

    }, {"../acc.module": 2}],
    68: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function apiPromise($http, $q) {

            function promise($httpPromise) {
                var deferred = $q.defer();

                $httpPromise.success(function (result) {
                    if (result.isValid) {
                        deferred.resolve(result.returnValue);
                    } else {
                        deferred.reject(result.errors);
            }
                }).error(function (error) {
                    console.error(error);
                    deferred.reject(['Internal Error']);
                });

                return deferred.promise;
            }

            return {
                get: function get(url, data) {
                    var deferred = $q.defer();

                    $http.get(url, data).success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                        console.error(error);
                        deferred.reject(['Internal Error']);
            });

                    return deferred.promise;
                },
                post: function post(url, data) {
                    return promise($http.post(url, data));
                },
                put: function put(url, data) {
                    return promise($http.put(url, data));
                },
                delete: function _delete(url, data) {
                    return promise($http.delete(url, data));
        }
            };
        }

        _acc2.default.factory('apiPromise', apiPromise);

    }, {"../acc.module": 2}],
    69: [function (require, module, exports) {
        'use strict';

        var _sweetalert = require('sweetalert');

        var _sweetalert2 = _interopRequireDefault(_sweetalert);

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function confirm(translate, $q) {

            return function (message, title, type) {
                var deferred = $q.defer();

                (0, _sweetalert2.default)({
                    title: title,
                    text: message,
                    type: type || "warning",
                    showCancelButton: true,
                    cancelButtonText: translate('No'),
                    confirmButtonText: translate('Yes')
                }, function (isConfirm) {
                    if (isConfirm) deferred.resolve();
                });

                return deferred.promise;
            };
        }

        _acc2.default.factory('confirm', confirm);

    }, {"../acc.module": 2, "sweetalert": "sweetalert"}],
    70: [function (require, module, exports) {
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
    71: [function (require, module, exports) {
        "use strict";

        var _acc = require("../acc.module");

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function gridFilterCellTypeProvider() {
            var type = {
                string: {
                    showOperators: false,
                    operator: "contains",
                    modelType: "string"
                },
                number: {
                    showOperators: true,
                    operator: "eq",
                    modelType: "number"
                },
                date: {
                    showOperator: true,
                    operator: "eq",
                    modelType: "string",
                    template: function template(args) {
                        args.element.kendoDatePicker();
                    }
                },
                boolean: {}
            };

            function combo(option) {
                return {
                    showOperators: false,
                    operator: "eq",
                    template: function template(args) {
                        args.element.kendoComboBox({
                            placeholder: '...',
                            dataTextField: option.text,
                            dataValueField: option.value,
                            valuePrimitive: true,
                            filter: "contains",
                            autoBind: false,
                            minLength: 2,
                            dataSource: {
                                type: "json",
                                serverFiltering: true,
                                transport: {
                                    read: {
                                        url: option.url
                                    },
                                    parameterMap: function parameterMap(options) {
                                        return kendo.stringify(options);
                                    }
                                },
                                schema: {
                                    parse: function parse(response) {
                                        return response.data;
                                    }
                        }
                    }
                        });
            }
                };
            }

            function dropdown(option) {
                return {
                    showOperators: false,
                    operator: "eq",
                    template: function template(args) {
                        args.element.kendoDropDownList({
                            dataTextField: option.text,
                            dataValueField: option.value,
                            filter: "contains",
                            autoBind: false,
                            minLength: 2,
                            dataSource: option.data,
                            valuePrimitive: true
                        });
            }
                };
            }

            this.control = {
                combo: combo,
                dropdown: dropdown
            };

            this.$get = function () {
                return type;
            };

            this.set = function (extendedObject) {
                type = angular.extend(type, extendedObject);
            };
        }

        _acc2.default.provider('gridFilterCellType', gridFilterCellTypeProvider);

    }, {"../acc.module": 2}],
    72: [function (require, module, exports) {
        'use strict';

        var _sweetalert = require('sweetalert');

        var _sweetalert2 = _interopRequireDefault(_sweetalert);

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function logger(translate) {
            return {
                success: function success(message) {
                    (0, _sweetalert2.default)({
                        title: translate('Successful'),
                        text: message || translate('Done successfully'),
                        type: 'success',
                        timer: 2000,
                        confirmButtonText: translate('OK')
            });
                },
                info: function info(message) {
                    (0, _sweetalert2.default)({
                        title: translate('Info'),
                        text: message,
                        type: 'info',
                        timer: 2000,
                        confirmButtonText: translate('OK')
                    });
                },
                warning: function warning(message) {
                    (0, _sweetalert2.default)({
                        title: translate('Warning'),
                        text: message,
                        type: 'warning',
                        timer: 2000,
                        confirmButtonText: translate('OK')
                    });
                },
                error: function error(message) {
                    (0, _sweetalert2.default)({
                        title: translate('Error'),
                        text: message,
                        type: 'error',
                        timer: 2000,
                        confirmButtonText: translate('OK')
                    });
        }
            };
        }

        _acc2.default.factory('logger', logger);

    }, {"../acc.module": 2, "sweetalert": "sweetalert"}],
    73: [function (require, module, exports) {
        'use strict';

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

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var menuItemsProvider = function () {
            function menuItemsProvider() {
                _classCallCheck(this, menuItemsProvider);

                this.menuItems = [];
            }

            _createClass(menuItemsProvider, [{
                key: '$get',
                value: function $get() {
                    return this.menuItems;
                }
            }, {
                key: 'add',
                value: function add(item) {
                    this.menuItems.push(item);

                    return this;
        }
            }]);

            return menuItemsProvider;
        }();

        _acc2.default.provider('menuItems', menuItemsProvider);

    }, {"../acc.module": 2}],
    74: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function modalBase($modal, $q) {

            /*{controller: string, templateUrl: string, size(optional): string, data: object}*/

            var modalFunction = function modalFunction(option) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: option.templateUrl,
                    controller: option.controller,
                    backdrop: true,
                    keyboard: false,
                    size: option.size, // nothing = normal , 'sm' = small , 'lg' = large
                    resolve: {
                        data: function data() {
                            return option.data;
                        }
            }
                });

                var deferred = $q.defer();

                modalInstance.result.then(function (result) {
                    deferred.resolve(result);
                });

                return deferred.promise;
            };

            return function (option) {
                return {
                    show: function show(data) {
                        option.data = data;
                        return modalFunction(option);
            }
                };
            };
        }

        _acc2.default.factory('modalBase', modalBase);

    }, {"../acc.module": 2}],
    75: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function routeNavigatorService($route, $location) {

            function getRoute(name) {
                return getKeys($route.routes).asEnumerable().select(function (r) {
                    return $route.routes[r];
                }).first(function (r) {
                    return r.controller == '{0}Controller'.format(name);
                });
            }

            var navigate = function navigate(name, parameters) {
                var route = getRoute(name);
                var path = route.originalPath;

                route.keys.forEach(function (key) {
                    var parameterValue = parameters[key.name] || '';
                    if (parameterValue == '' && key.optional == true) throw new Error('[{0}] parameter is not optional'.format(key.name));

                    path = path.replace(new RegExp(':{0}'.format(key.name)), parameterValue);
                });

                $location.path(path);
            };

            return navigate;
        }

        _acc2.default.factory('navigate', routeNavigatorService);

    }, {"../acc.module": 2}],
    76: [function (require, module, exports) {
        'use strict';

        var _acc = require('../acc.module');

        var _acc2 = _interopRequireDefault(_acc);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
        }

        function translate($filter) {
            return function (key) {
                return $filter('translate')(key);
            };
        }

        _acc2.default.factory('translate', translate);

    }, {"../acc.module": 2}],
    77: [function (require, module, exports) {
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
