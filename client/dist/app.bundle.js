(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = branchApi;
function branchApi(apiPromise) {
    "use strict";

    var prefixUrl = '/api/branches';
    return {
        create: function create(branch) {
            return apiPromise.post("" + prefixUrl, branch);
        },
        all: function all() {
            return apiPromise.get("" + prefixUrl);
        },
        my: function my() {
            return apiPromise.get(prefixUrl + "/my");
        },
        addMember: function addMember(userId) {
            return apiPromise.post(prefixUrl + "/members/add", { userId: userId });
        },
        getMembers: function getMembers() {
            return apiPromise.get(prefixUrl + "/members");
        },
        changeStateMember: function changeStateMember(memberId) {
            return apiPromise.put(prefixUrl + "/members/change-state/" + memberId);
        }
    };
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = userApi;
function userApi(apiPromise) {
    "use strict";

    var prefixUrl = '/api/users';
    return {
        login: function login(user) {
            return apiPromise.post(prefixUrl + "/login", user);
        },
        logout: function logout() {
            return apiPromise.post(prefixUrl + "/logout");
        },
        isUniqueEmail: function isUniqueEmail(email) {
            return apiPromise.get(prefixUrl + "/is-unique-email/" + email);
        },
        register: function register(user) {
            return apiPromise.post(prefixUrl + "/register", user);
        },
        getByEmail: function getByEmail(email) {
            return apiPromise.get(prefixUrl + "/by-email/" + email);
        },
        getAuthReturnUrl: function getAuthReturnUrl() {
            return apiPromise.get(prefixUrl + "/return-url");
        }
    };
}

},{}],3:[function(require,module,exports){
'use strict';

var _app = require('./app.module');

var _app2 = _interopRequireDefault(_app);

var _config = require('./config/config.route');

var _config2 = _interopRequireDefault(_config);

var _config3 = require('./config/config.translate');

var _config4 = _interopRequireDefault(_config3);

var _config5 = require('./config/config.http');

var _config6 = _interopRequireDefault(_config5);

var _config7 = require('./config/config.cookie');

var _config8 = _interopRequireDefault(_config7);

var _homeController = require('./controllers/homeController');

var _homeController2 = _interopRequireDefault(_homeController);

var _loginController = require('./controllers/loginController');

var _loginController2 = _interopRequireDefault(_loginController);

var _branchCreateController = require('./controllers/branchCreateController');

var _branchCreateController2 = _interopRequireDefault(_branchCreateController);

var _branchChooseController = require('./controllers/branchChooseController');

var _branchChooseController2 = _interopRequireDefault(_branchChooseController);

var _registerController = require('./controllers/registerController');

var _registerController2 = _interopRequireDefault(_registerController);

var _registerSuccessController = require('./controllers/registerSuccessController');

var _registerSuccessController2 = _interopRequireDefault(_registerSuccessController);

var _branchAddMemberController = require('./controllers/branchAddMemberController');

var _branchAddMemberController2 = _interopRequireDefault(_branchAddMemberController);

var _branchMembersController = require('./controllers/branchMembersController');

var _branchMembersController2 = _interopRequireDefault(_branchMembersController);

var _shell = require('./directives/shell');

var _shell2 = _interopRequireDefault(_shell);

var _content = require('./directives/content');

var _content2 = _interopRequireDefault(_content);

var _validationSummary = require('./directives/validationSummary');

var _validationSummary2 = _interopRequireDefault(_validationSummary);

var _uploader = require('./directives/uploader');

var _uploader2 = _interopRequireDefault(_uploader);

var _content3 = require('./directives/content.alert');

var _content4 = _interopRequireDefault(_content3);

var _button = require('./directives/button');

var _button2 = _interopRequireDefault(_button);

var _tile = require('./directives/tile');

var _tile2 = _interopRequireDefault(_tile);

var _apiPromise = require('./services/apiPromise');

var _apiPromise2 = _interopRequireDefault(_apiPromise);

var _formService = require('./services/formService');

var _formService2 = _interopRequireDefault(_formService);

var _routeNavigatorService = require('./services/routeNavigatorService');

var _routeNavigatorService2 = _interopRequireDefault(_routeNavigatorService);

var _logger = require('./services/logger');

var _logger2 = _interopRequireDefault(_logger);

var _translate = require('./services/translate');

var _translate2 = _interopRequireDefault(_translate);

var _authService = require('./services/authService');

var _authService2 = _interopRequireDefault(_authService);

var _branchStateService = require('./services/branchStateService');

var _branchStateService2 = _interopRequireDefault(_branchStateService);

var _settingsProvider = require('./services/settingsProvider');

var _settingsProvider2 = _interopRequireDefault(_settingsProvider);

var _api = require('./apis/api.user');

var _api2 = _interopRequireDefault(_api);

var _api3 = require('./apis/api.branch');

var _api4 = _interopRequireDefault(_api3);

var _app3 = require('./app.run');

var _app4 = _interopRequireDefault(_app3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//provider


//directives
_app2.default.config(_config2.default).config(_config4.default).config(_config6.default).config(_config8.default).run(_app4.default).provider(_settingsProvider2.default.name, _settingsProvider2.default).factory(_apiPromise2.default.name, _apiPromise2.default).factory(_formService2.default.name, _formService2.default).factory(_routeNavigatorService2.default.name, _routeNavigatorService2.default).factory(_api2.default.name, _api2.default).factory(_api4.default.name, _api4.default).factory(_logger2.default.name, _logger2.default).factory(_translate2.default.name, _translate2.default).factory(_authService2.default.name, _authService2.default).factory(_branchStateService2.default.name, _branchStateService2.default).controller(_homeController2.default.name, _homeController2.default).controller(_loginController2.default.name, _loginController2.default).controller(_registerController2.default.name, _registerController2.default).controller(_registerSuccessController2.default.name, _registerSuccessController2.default).controller(_branchCreateController2.default.name, _branchCreateController2.default).controller(_branchChooseController2.default.name, _branchChooseController2.default).controller(_branchAddMemberController2.default.name, _branchAddMemberController2.default).controller(_branchMembersController2.default.name, _branchMembersController2.default).directive(_registerController.matchPassword.name, _registerController.matchPassword).directive(_registerController.uniqueEmail.name, _registerController.uniqueEmail).directive(_shell2.default.name, _shell2.default).directive(_content2.default.name, _content2.default).directive(_validationSummary2.default.name, _validationSummary2.default).directive(_uploader2.default.name, _uploader2.default).directive(_content4.default.name, _content4.default).directive(_button2.default.name, _button2.default).directive(_tile2.default.name, _tile2.default);

// load modals


// load apis


//services


//load controllers


// load config
_app2.default.init();

},{"./apis/api.branch":1,"./apis/api.user":2,"./app.module":4,"./app.run":5,"./config/config.cookie":6,"./config/config.http":7,"./config/config.route":8,"./config/config.translate":9,"./controllers/branchAddMemberController":10,"./controllers/branchChooseController":11,"./controllers/branchCreateController":12,"./controllers/branchMembersController":13,"./controllers/homeController":14,"./controllers/loginController":15,"./controllers/registerController":16,"./controllers/registerSuccessController":17,"./directives/button":18,"./directives/content":20,"./directives/content.alert":19,"./directives/shell":21,"./directives/tile":22,"./directives/uploader":23,"./directives/validationSummary":24,"./services/apiPromise":25,"./services/authService":26,"./services/branchStateService":27,"./services/formService":28,"./services/logger":29,"./services/routeNavigatorService":30,"./services/settingsProvider":31,"./services/translate":32}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-sanitize');

require('angular-animate');

require('angular-bootstrap');

require('angular-route');

require('angular-translate');

require('angular-messages');

require('angular-cookies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appModule = _angular2.default.module('app.module', ['ngAnimate', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'pascalprecht.translate', 'ngMessages', 'ngCookies']);

appModule.init = function () {
    _angular2.default.element(document).ready(function () {
        _angular2.default.bootstrap(document, ['app.module']);
    });
};

exports.default = appModule;

},{"angular":"angular","angular-animate":"angular-animate","angular-bootstrap":"angular-bootstrap","angular-cookies":"angular-cookies","angular-messages":"angular-messages","angular-route":"angular-route","angular-sanitize":"angular-sanitize","angular-translate":"angular-translate"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ($rootScope, authService, navigate) {
    "use strict";

    $rootScope.$on('$routeChangeStart', function (e, next, current) {
        var isAuthRequired = next.$$route.data.requireAuth;

        if (!isAuthRequired) return;

        if (authService.isAuth()) return;

        e.preventDefault();
        navigate('login', null, { returnUrl: next.$$route.originalPath });
    });
};

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ($cookiesProvider) {
    "use strict";

    $cookiesProvider.defaults.path = '/';
    /*$cookiesProvider.defaults.secure = true;*/
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ($httpProvider) {
    "use strict";

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ($routeProvider, $locationProvider, settingsProvider) {
    "use strict";

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $routeProvider.when('/', {
        controller: 'homeController',
        controllerAs: 'model',
        templateUrl: 'partials/views/home.html',
        data: {
            requireAuth: false
        }
    }).when('/login/:isAuth?', {
        controller: 'loginController',
        controllerAs: 'model',
        templateUrl: 'partials/views/login.html',
        data: {
            requireAuth: false
        }
    }).when('/register', {
        controller: 'registerController',
        controllerAs: 'model',
        templateUrl: 'partials/views/register.html',
        data: {
            requireAuth: false
        }
    }).when('/register/success/:name', {
        controller: 'registerSuccessController',
        controllerAs: 'model',
        templateUrl: 'partials/views/registerSuccess.html',
        data: {
            requireAuth: false
        }
    }).when('/branch/new', {
        controller: 'branchCreateController',
        controllerAs: 'model',
        templateUrl: 'partials/views/branchCreate.html',
        data: {
            requireAuth: true
        }
    }).when('/branch/choose/:isAuth?', {
        controller: 'branchChooseController',
        controllerAs: 'model',
        templateUrl: 'partials/views/branchChoose.html',
        data: {
            requireAuth: true
        }
    }).when('/branch/member/add', {
        controller: 'branchAddMemberController',
        controllerAs: 'model',
        templateUrl: 'partials/views/branchAddMember.html',
        data: {
            requireAuth: true
        }
    }).when('/branch/members', {
        controller: 'branchMembersController',
        controllerAs: 'model',
        templateUrl: 'partials/views/branchMembers.html',
        data: {
            requireAuth: true
        }
    });
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ($translateProvider) {
    "use strict";

    var translate = JSON.parse(localStorage.getItem('translate'));

    $translateProvider.translations('fa_IR', translate);
    $translateProvider.preferredLanguage('fa_IR');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    //$translateProvider.useStorage('translateStorageService');
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = branchAddMemberController;
function branchAddMemberController(formService, navigate, branchApi, userApi, logger) {
    "use strict";

    var _this = this;

    this.selectedUser = null;
    this.email = null;
    this.errors = [];

    this.search = function (form) {
        logger.success();
        if (form.$invalid) return formService.setDirty(form);

        userApi.getByEmail(_this.email).then(function (result) {
            return _this.selectedUser = result;
        });
    };

    this.add = function (form) {
        if (form.$invalid) return formService.setDirty(form);

        branchApi.addMember(_this.selectedUser.id).then(function () {
            return logger.success();
        }).catch(function (err) {
            return _this.errors = err;
        });
    };
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = branchChooseController;
function branchChooseController($scope, branchApi, userApi, $cookies, navigate, $routeParams, $window) {
    "use strict";

    var _this = this;

    this.isAuth = $routeParams.isAuth;
    this.branches = [];
    this.selectedBranch = {};

    branchApi.my().then(function (result) {
        return _this.branches = result;
    });

    this.select = function (branch) {
        _this.selectedBranch = branch;
        $cookies.put('branch-id', branch.id);
        $scope.$emit('branch-changed', branch);

        if (_this.isAuth) return userApi.getAuthReturnUrl().then(function (returnUrl) {
            debugger;
            $window.location.href = returnUrl;
        });

        navigate('home');
    };
}

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = branchCreateController;
function branchCreateController(branchApi, formService, navigate) {
    "use strict";

    var _this = this;

    this.errors = [];
    this.isSaved = false;

    this.branch = {
        name: '',
        logo: '',
        phone: '',
        address: ''
    };

    this.uploadingState = 'none';
    this.imageFileName = '';

    this.uploaded = function (response) {
        _this.uploadingState = 'uploaded';
        _this.imageFileName = '/' + response.fullName;
        _this.branch.logo = response.name;
    };

    this.uploadAnotherFile = function () {
        _this.uploadingState = 'none';
        _this.branch.logo = '';
    };

    this.create = function (form) {
        if (form.$invalid) return formService.setDirty(form);

        branchApi.create(_this.branch).then(function () {
            return _this.isSaved = true;
        }).catch(function (err) {
            return _this.errors = err;
        });
    };
}

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = branchMembersController;
function branchMembersController(branchApi, logger) {
    "use strict";

    var _this = this;

    this.members = [];
    this.errors = [];

    this.fetch = function () {
        return branchApi.getMembers().then(function (result) {
            return _this.members = result.asEnumerable().select(function (m) {
                if (m.state == 'active') {
                    m.icon = 'glyphicon-ok-circle';
                    m.style = { 'color': 'green' };
                    m.command = {
                        title: 'Deactivate',
                        icon: 'glyphicon-remove-circle',
                        isDisabled: false
                    };
                }
                if (m.state == 'inactive') {
                    m.icon = 'glyphicon-remove-circle';
                    m.style = { 'color': 'red' };
                    m.command = {
                        title: 'Activate',
                        icon: 'glyphicon-ok-circle',
                        isDisabled: false
                    };
                }

                return m;
            }).toArray();
        });
    };

    this.fetch();

    this.changeState = function (member) {
        debugger;

        member.command.isDisabled = true;

        branchApi.changeStateMember(member.id).then(_this.fetch).catch(function (err) {
            return _this.errors = err;
        }).finally(function () {
            return member.command.isDisabled = false;
        });
    };
}

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = homeController;
function homeController($scope, branchStateService, authService) {
    "use strict";

    var _this = this;

    this.branch = branchStateService.get();
    this.isAuth = authService.isAuth();

    $scope.$on('login-changed', function () {
        return _this.isAuth = authService.isAuth();
    });

    $scope.$on('branch-changed', function () {
        return _this.branch = branchStateService.get();
    });
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = loginController;
function loginController($scope, userApi, formService, navigate, $window, $location, $routeParams) {
    "use strict";

    var _this = this;

    this.isAuth = $routeParams.isAuth;
    this.errors = [];

    this.loginModel = {
        email: '',
        password: ''
    };

    this.returnUrl = $location.search() ? $location.search().returnUrl : null;

    this.login = function (form) {
        if (form.$invalid) return formService.setDirty(form);

        userApi.login(_this.loginModel).then(function (result) {
            $scope.$emit('user-login', { currentUser: result.currentUser });

            if (!(result.returnUrl || _this.isAuth)) {
                return _this.returnUrl ? $location.url(_this.returnUrl) : navigate('home');
            }

            if (result.returnUrl) $window.location.href = result.returnUrl;

            navigate('branchChoose', { isAuth: 'auth' });
        }).catch(function (errors) {
            debugger;
            _this.errors = errors;
        });
    };
}

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = registerController;
exports.matchPassword = matchPassword;
exports.uniqueEmail = uniqueEmail;
function registerController(userApi, formService, navigate) {
    "use strict";

    var _this = this;

    this.user = {
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    };

    this.register = function (form) {
        if (form.$invalid) return formService.setDirty(form);

        userApi.register(_this.user).then(function (result) {
            return navigate('registerSuccess', { name: _this.user.name });
        }).catch(function (errors) {
            return _this.errors = errors;
        });
    };
}

var directiveId = 'matchPassword';

function matchPassword($parse) {
    "use strict";

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function link(scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            if (!attrs[directiveId]) return;

            var firstPassword = $parse(attrs[directiveId]);

            var validator = function validator(value) {
                var temp = firstPassword(scope),
                    v = value === temp;
                ctrl.$setValidity('match', v);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe(directiveId, function () {
                validator(ctrl.$viewValue);
            });
        }
    };
}

function uniqueEmail(userApi) {
    "use strict";

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function link(scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            var validator = function validator(value) {
                if (!value) return;

                userApi.isUniqueEmail(value).then(function (result) {
                    return ctrl.$setValidity('unique', !result.isValid);
                });

                return value;
            };

            elem.on('blur', function () {
                validator(ctrl.$viewValue);
            });
        }
    };
}

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = registerSuccessController;
function registerSuccessController($routeParams) {
    "use strict";

    this.name = $routeParams.name;
}

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = devTagButton;
function devTagButton() {
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
        link: function link(scope, element, attrs) {}
    };
}

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = devTagContentAlert;
function devTagContentAlert() {
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-alert-template.html',
        transclude: true,
        replace: true,
        scope: {
            alertType: '@'
        },
        link: function link(scope, element, attrs) {
            scope.width = attrs.width;

            scope.icon = getIconCss(scope.alertType);

            function getIconCss(type) {
                switch (type) {
                    case 'success':
                        return 'glyphicon-ok-circle';
                        break;
                    case 'warning':
                        return 'glyphicon-alert';
                        break;
                    case 'danger':
                        return 'glyphicon-remove-circle';
                        break;
                    case 'info':
                        return 'glyphicon-info-sign';
                }
            }
        }
    };
}

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = devTagContent;
function devTagContent() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-template.html',
        transclude: true,
        replace: true,
        scope: {},
        link: function link(scope, element, attrs) {
            scope.title = attrs.title;
            scope.width = attrs.width;
        }
    };
}

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = shell;
function shell(userApi, authService, branchStateService, $route) {
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.html',
        link: function link(scope, element, attrs) {
            var currnetUser = localStorage.getItem('currentUser');
            var currentBranch = JSON.parse(localStorage.getItem('currentBranch'));

            scope.currentBranch = currentBranch || false;
            branchStateService.set(scope.currentBranch);

            if (currnetUser && currnetUser != '') {
                scope.isAuth = true;
                scope.currentUser = currnetUser;
                authService.setUser(currnetUser);
            } else {
                scope.isAuth = false;
                scope.currentUser = '';
            }

            scope.$on('user-logout', logoutOnLocal);

            scope.$on('user-login', function (e, data) {
                scope.isAuth = true;
                scope.currentUser = data.currentUser;
                authService.setUser(data.currentUser);

                scope.$broadcast('login-changed');

                if (!scope.$$phase) scope.$apply();
            });

            scope.$on('branch-changed', function (e, branch) {
                scope.currentBranch = branch;
                branchStateService.set(branch);
            });

            scope.logout = function () {
                userApi.logout().then(logoutOnLocal);
            };

            function logoutOnLocal() {
                scope.isAuth = false;
                scope.currentUser = '';
                authService.setUser(null);

                scope.$broadcast('login-changed');

                var currentRoute = $route.current;
                if (currentRoute.$$route.data.requireAuth) $route.reload();

                if (!scope.$$phase) scope.$apply();
            }
        }
    };
}

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = devTagTile;
function devTagTile() {
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'partials/templates/tile-template.html',
        transclude: true,
        replace: true
    };
}

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = devTagUploader;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

require('jquery.filedrop');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function devTagUploader($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/uploader.html',
        replace: true,
        scope: {
            before: '&',
            uploaded: '&'
        },
        link: function link(scope, element, attrs) {
            scope.state = 'none';

            (0, _jquery2.default)(element).filedrop({
                url: '/upload',
                dragOver: function dragOver() {
                    var $elm = (0, _jquery2.default)(element).find('.place_drag');
                    $elm.addClass('place_drag_uploader');
                    $elm.find('.hover_upload_list').addClass('webfont_file');

                    scope.state = 'dragging';
                    scope.$apply();
                },
                dragLeave: function dragLeave() {
                    var $elm = (0, _jquery2.default)(element).find('.place_drag');
                    $elm.removeClass('place_drag_uploader');
                    $elm.find('.hover_upload_list').removeClass('webfont_file');
                    //$elm.find('.place_drag_text1').show();

                    scope.state = 'none';
                    scope.$apply();
                },
                uploadStarted: function uploadStarted() {
                    var $elm = (0, _jquery2.default)(element).find('.place_drag');
                    $elm.removeClass('place_drag_uploader');
                    $elm.find('.hover_upload_list').removeClass('webfont_file');
                    $elm.find('.place_drag_text1').hide();

                    scope.state = 'uploading';
                    scope.$apply();
                    scope.before();
                },
                uploadFinished: function uploadFinished(i, file, response, time) {
                    scope.uploaded({ response: response });
                    scope.state = 'none';
                    scope.$apply();
                },
                error: function error(err, file) {
                    scope.state = 'none';
                    scope.$apply();

                    switch (err) {
                        case 'BrowserNotSupported':
                            //logger.error('browser does not support HTML5 drag and drop');
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

},{"jquery":"jquery","jquery.filedrop":"jquery.filedrop"}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = devTagValidationSummary;
function devTagValidationSummary() {
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'partials/templates/validationSummary.html',
        replace: true,
        scope: {
            errors: '='
        }
    };
}

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = apiPromise;
function apiPromise($http, $q, translate) {

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

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = authService;
function authService() {
    "use strict";

    var user = void 0;

    return {
        setUser: function setUser(id) {
            return user = id;
        },
        isAuth: function isAuth() {
            return user ? true : false;
        }
    };
}

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = branchStateService;
function branchStateService() {
    "use strict";

    var branch = false;

    return {
        set: function set(b) {
            return branch = b;
        },
        get: function get() {
            return branch;
        }
    };
}

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = formService;
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

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = logger;

var _sweetalert = require('sweetalert');

var _sweetalert2 = _interopRequireDefault(_sweetalert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logger(translate) {
    return {
        success: function success(message) {
            (0, _sweetalert2.default)({
                title: translate('Successful'),
                text: message || '',
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

},{"sweetalert":"sweetalert"}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = navigate;
function navigate($route, $location) {

    function getRoute(name) {
        return getKeys($route.routes).asEnumerable().select(function (r) {
            return $route.routes[r];
        }).first(function (r) {
            return r.controller == '{0}Controller'.format(name);
        });
    }

    var navigate = function navigate(name, parameters, queryString) {
        var route = getRoute(name);var path = route.originalPath;

        route.keys.forEach(function (key) {
            var parameterValue = parameters[key.name] || '';
            if (parameterValue == '' && key.optional == true) throw new Error('[{0}] parameter is not optional'.format(key.name));

            path = path.replace(':' + key.name + (key.optional ? '?' : ''), parameterValue);
        });

        if (queryString) $location.search(queryString);

        $location.path(path);
    };

    return navigate;
}

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = settings;
var storage = window.localStorage;

function settings() {
    "use strict";

    this.$get = function () {
        return storage;
    };
}

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = translate;
function translate($filter) {
    return function (key) {
        return $filter('translate')(key);
    };
}

},{}]},{},[3])
//# sourceMappingURL=app.bundle.js.map
