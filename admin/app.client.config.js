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

import apiPromise from "../accounting/client/src/services/apiPromise";
import {body, content, footer, heading} from "../accounting/client/src/directives/content";
import logger from "../accounting/client/src/services/logger";
import button from "../accounting/client/src/directives/button";

import shell from "./client/shell";

import BranchApi from "../accounting/client/src/branch/branchApi";
import BranchesController from "./client/branches";
import UserApi from './client/userApi';
import UsersController from "./client/users";

let adminModule = angular.module('admin.module', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router'
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
                template: ''
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
            });
    })
    .service('branchApi', BranchApi)
    .service('userApi', UserApi)
    .factory('apiPromise', apiPromise)
    .factory('logger', logger)
    .factory('translate', () => {
        return key => key;
    })
    .directive('devTagContent', content)
    .directive('devTagContentBody', body)
    .directive('devTagContentHeading', heading)
    .directive('devTagContentFooter', footer)
    .directive('devTagButton', button)
    .directive('shell', shell)
    .controller('branchesController', BranchesController)
    .controller('usersController', UsersController);




