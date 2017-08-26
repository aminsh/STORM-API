"use strict";

import "array-prototypes";
import "function-prototypes";
import "number-prototypes";
import "string-prototypes";
import "jquery-global-resolve";

import angular from "angular";
import 'angular-translate';
import "angular-animate";
import "angular-ui-router";
import "angular-sanitize";
import "angular-resource";

// [START] Storm Lumx Dependencies
import "moment";
import "velocity-animate";
import "storm-lumx";
// [-END-] Storm Lumx Dependencies

import apiPromise from "../accounting/client/src/services/apiPromise";
import navigate from "../accounting/client/src/services/routeNavigatorService";
import formService from "../accounting/client/src/services/formService";
import reportViewer from "../accounting/client/src/directives/reportViewer";
import {body, content, footer, heading} from "../accounting/client/src/directives/content";
import BranchApi from "../accounting/client/src/branch/branchApi";
import saleApi from "../accounting/client/src/sales/saleApi";
import BranchThirdPartyApi from "./client/branchThirdPartyApi";
import logger from "../accounting/client/src/services/logger";
import translateStorageService from "../accounting/client/src/services/translateStorageService";
import translate from "../accounting/client/src/services/translate";

// Controllers
import ThirdPartyController from "./client/thirdParty.controller";
import PayPingController from "./client/payPing.controller";

// Configs
import translateConfig from '../accounting/client/src/config/translate.config';

let thirdPartyModule = angular.module('thirdParty.module', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'pascalprecht.translate',
        'lumx'
    ]),
    devConstants = {
        urls: {
            rootUrl: '/third-party/api'
        }
    };

thirdPartyModule
    .config(translateConfig)
    .run(($rootScope,$location) => {
        $rootScope.user = {};

        let locationSearch = false;

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                locationSearch = $location.search();
            });

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {

                $location.search(locationSearch);
            });

    })
    .config(($stateProvider, $urlRouterProvider, $locationProvider) => {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $urlRouterProvider.otherwise('/not-found');

        $stateProvider
            .state('third-party', {
                url: '/',
                controller: 'thirdPartyController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/thirdParty.html'
            });
        $stateProvider
            .state('payping', {
                url: '/payping',
                controller: 'payPingController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/payPing.html'
            });

    })
    .constant('devConstants', devConstants)
    .service('branchApi', BranchApi)
    .service('formService', formService)
    .service('branchThirdPartyApi', BranchThirdPartyApi)
    .service('translate', translate)
    .factory('apiPromise', apiPromise)
    .factory('navigate', navigate)
    .factory('saleApi', saleApi)
    .factory('logger', logger)
    .factory('translateStorageService', translateStorageService)
    .directive('devTagContent', content)
    .directive('devTagContentBody', body)
    .directive('devTagContentHeading', heading)
    .directive('devTagContentFooter', footer)
    .directive('devTagReportViewer', reportViewer)
    .controller('thirdPartyController', ThirdPartyController)
    .controller('payPingController', PayPingController);