"use strict";

import "array-prototypes";
import "function-prototypes";
import "number-prototypes";
import "string-prototypes";
import "jquery-global-resolve";

import "ckeditor";

import angular from "angular";
import "angular-animate";
import "angular-ui-router";
import "angular-sanitize";
import "angular-resource";
import "angular-translate";
import 'angular-ui-bootstrap';
import "jsonformatter";
import 'angular-ui-select';

import clipboardModule from 'angular-clipboard';
import 'angular-ui-codemirror';

// [START] Storm Lumx Dependencies
/*import "moment";
import "velocity-animate";
import "storm-lumx";*/
// [-END-] Storm Lumx Dependencies

import apiPromise from "../accounting/client/src/services/apiPromise";
import {body, content, footer, heading} from "../accounting/client/src/directives/content";
import logger from "../accounting/client/src/services/logger";
import confirm from "../accounting/client/src/services/confirm";
import Promise from "../accounting/client/src/services/promise";
import button from "../accounting/client/src/directives/button";
import grid from "../accounting/client/src/directives/grid";
import gridFilter from "../accounting/client/src/directives/grid.filter";
import gridSort from "../accounting/client/src/directives/grid.sort";
import dataTable from "../accounting/client/src/directives/dataTable";
import paging from "../accounting/client/src/directives/paging";
import ngHtmlCompile from "../accounting/client/src/directives/ngHtmlCompile";
import radio from "../accounting/client/src/directives/radio";
import combo from "../accounting/client/src/directives/combobox";

import shell from "./client/directives/shell";
import DocsTreeDir from "./client/directives/docsTreeDir";
import Editor from "./client/directives/editor";

import BranchApi from "../accounting/client/src/branch/branchApi";
import BranchesController from "./client/branches";
import UserApi from "./client/userApi";
import UsersController from "./client/users";
import HomeController from "./client/home";
import DocsApi from "./client/docsApi";
import DocsController from "./client/docs";
import AddDocController from "./client/addDoc";
import EditDocController from "./client/editDoc";
import PubSub from './client/pubSub';
import Tabs from "./client/tabs";
import ApplicationLoggerController from "./client/applicationLogger";
import BranchSettingsController from "./client/branchSettings";

let adminModule = angular.module('admin.module', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap',
    'lumx',
    'jsonFormatter',
    'ui.select',
    clipboardModule.name,
    'ui.codemirror'
]);


adminModule
    .run($rootScope => {
        $rootScope.user = {};
    })

    .config(($stateProvider, $urlRouterProvider, $locationProvider) => {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'homeController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/home.html',
                onExit: pubSub => pubSub.unsubscribeAll()
            })
            .state('branches', {
                url: '/branches',
                controller: 'branchesController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/branches.html'
            })
            .state('users', {
                url: '/users',
                controller: 'usersController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/users.html'
            })
            .state('docs', {
                url: '/docs',
                controller: 'docsController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/docs.html'
            })
            .state('addDoc', {
                url: '/docs/add',
                controller: 'addDocController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/addDoc.html'
            })
            .state('editDoc', {
                url: '/docs/edit/:pageId',
                controller: 'editDocController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/editDoc.html'
            })
            .state('logger', {
                url: '/logger',
                controller: 'applicationLoggerController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/applicationLogger.html'
            })
            .state('branchSettings', {
                url: '/branch-settings',
                controller: 'branchSettingsController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/branchSettings.html'
            });
    })
    .service('branchApi', BranchApi)
    .service('userApi', UserApi)
    .service('pubSub', PubSub)
    .service('tabs', Tabs)
    .service('docsApi', DocsApi)
    .factory('apiPromise', apiPromise)
    .factory('logger', logger)
    .factory('confirm', confirm)
    .service('promise', Promise)
    .factory('translate', () => {
        return key => key;
    })
    .directive('devTagContent', content)
    .directive('devTagContentBody', body)
    .directive('devTagContentHeading', heading)
    .directive('devTagContentFooter', footer)
    .directive('devTagGrid', grid)
    .directive('devTagGridFilter', gridFilter)
    .directive('devTagGridSort', gridSort)
    .directive('devTagPaging', paging)
    .directive('devDataTable', dataTable)
    .directive('ngHtmlCompile', ngHtmlCompile)
    .directive('devTagButton', button)
    .directive('shell', shell)
    .directive('docsTreeDir', DocsTreeDir)
    .directive('editor', Editor)
    .directive('devTagRadio', radio)
    .directive('devTagComboBox', combo)

    .provider('gridFilterCellType', function () {
        let type = {
            string: {
                operator: "contains",
                template: `<input class="form-control" type="text" ng-model="filter.value"/>`,
                style: {width: '300px'}
            },
            applicationLoggerStatus: {
                data: ['pending', 'success', 'invalid', 'error'],
                template: `<li ng-repeat="item in items">
                    <dev-tag-radio 
                        style="margin-bottom: 5px"
                        ng-class="{'checked': item == filter.value}"
                        ng-model="filter.value" 
                        k-value="{{item}}"></dev-tag-radio>
                        
                               <i  ng-if="item === 'pending'" class="fa fa-history fa-lg text-success"></i>
                               <i  ng-if="item === 'success'" class="fa fa-check fa-lg text-navy"></i>
                               <i  ng-if="item === 'invalid'" class="fa fa-exclamation-triangle fa-lg text-warning"></i>
                               <i  ng-if="item === 'error'" class="fa fa-times-circle fa-lg text-danger"></i>
                            {{item}}
                    </li>`
            },
            branch: {
                template: `<li>
                                    <dev-tag-combo-box
                                       k-placeholder="{{'Select' | translate}}"
                                       k-data-text-field="display"
                                       k-data-value-field="id"
                                       url="/api/branches"
                                       ng-model="filter.value"></dev-tag-combo-box>
                </li>`,
                style: {width: '400px'}
            }
        };

        this.$get = function () {
            return type;
        };
    })

    .controller('homeController', HomeController)
    .controller('branchesController', BranchesController)
    .controller('usersController', UsersController)
    .controller('docsController', DocsController)
    .controller('addDocController', AddDocController)
    .controller('editDocController', EditDocController)
    .controller('applicationLoggerController', ApplicationLoggerController)
    .controller('branchSettingsController', BranchSettingsController);

