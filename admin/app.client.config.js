"use strict";

import "array-prototypes";
import "function-prototypes";
import "number-prototypes";
import "string-prototypes";
import "jquery-global-resolve";

import angular from "angular";
import "angular-animate";
import "angular-ui-router";
import "angular-sanitize";
import "angular-resource";
import "angular-translate";
import 'angular-ui-bootstrap';

// [START] Storm Lumx Dependencies
import "moment";
import "velocity-animate";
import "storm-lumx";
// [-END-] Storm Lumx Dependencies

import apiPromise from "../accounting/client/src/services/apiPromise";
import {body, content, footer, heading} from "../accounting/client/src/directives/content";
import logger from "../accounting/client/src/services/logger";
import confirm from "../accounting/client/src/services/confirm";
import button from "../accounting/client/src/directives/button";
import grid from "../accounting/client/src/directives/grid";
import gridFilter from "../accounting/client/src/directives/grid.filter";
import gridSort from "../accounting/client/src/directives/grid.sort";
import dataTable from "../accounting/client/src/directives/dataTable";
import paging from "../accounting/client/src/directives/paging";
import ngHtmlCompile from "../accounting/client/src/directives/ngHtmlCompile";

import shell from "./client/shell";

import BranchApi from "../accounting/client/src/branch/branchApi";
import BranchesController from "./client/branches";
import UserApi from "./client/userApi";
import UsersController from "./client/users";
import HomeController from "./client/home";
import ApiDocsController from "./client/apiDocs";
import PubSub from './client/pubSub';
import Tabs from "./client/tabs";

let adminModule = angular.module('admin.module', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap',
    'lumx'
]);


adminModule
    .run($rootScope => {
        $rootScope.user = {};
    })
    .config(($stateProvider, $urlRouterProvider, $locationProvider) => {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $urlRouterProvider.otherwise('/not-found');

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
            .state('apiDocs', {
                url: '/api-docs',
                controller: 'apiDocsController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/apiDocs.html'
            });
    })
    .service('branchApi', BranchApi)
    .service('userApi', UserApi)
    .service('pubSub', PubSub)
    .service('tabs', Tabs)
    .factory('apiPromise', apiPromise)
    .factory('logger', logger)
    .factory('confirm', confirm)
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

    .provider('gridFilterCellType', function () {
        let type = {
            string: {
                operator: "contains",
                template: `<input class="form-control" type="text" ng-model="filter.value"/>`,
                style: {width: '300px'}
            }
        };

        this.$get = function () {
            return type;
        };
    })

    .controller('homeController', HomeController)
    .controller('branchesController', BranchesController)
    .controller('usersController', UsersController)
    .controller('apiDocsController', ApiDocsController);




