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
import 'angular-translate';

// [START] Storm Lumx Dependencies
import "moment";
import "velocity-animate";
import "storm-lumx";
// [-END-] Storm Lumx Dependencies

import ReportApi from "../accounting/client/src/apis/reportApi";
import apiPromise from "../accounting/client/src/services/apiPromise";
import logger from "../accounting/client/src/services/logger";
import navigate from "../accounting/client/src/services/routeNavigatorService";
import reportViewer from "../accounting/client/src/directives/reportViewer";
import ReportPrintController from "../accounting/client/src/report/reportPrint";
import {body, content, footer, heading} from "../accounting/client/src/directives/content";
import InvoiceViewController from "./client/invoiceView.controller";
import saleApi from "../accounting/client/src/sales/saleApi";
import Promise from "../accounting/client/src/services/promise";

// Api
import BranchApi from "../accounting/client/src/branch/branchApi";
import BranchThirdPartyApi from "../third-party/client/branchThirdPartyApi";
import InvoiceApi from "./client/invoiceApi";

import totalSum from '../accounting/client/src/filters/total';

let invoiceModule = angular.module('invoice.module', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'lumx',
        'pascalprecht.translate'
    ]),
    devConstants = {
        urls: {
            rootUrl: '/invoice/api'
        },
        reports: JSON.parse(localStorage.getItem('reports'))
    };

invoiceModule
    .run(($rootScope,$location) => {
        $rootScope.user = {};
        $rootScope.branch = JSON.parse(localStorage.getItem("currentBranch"));

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
            .state('report', {
                url: '/:id',
                controller: 'invoiceViewController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/invoiceView.html'
            })
            .state('print', {
                url: '/print/:key',
                controller: 'reportPrintController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/reportPrint.html'
            });
    })
    .config($translateProvider => {
        let translate = JSON.parse(localStorage.getItem('translate'));

        $translateProvider.translations('fa_IR', translate);
        //$translateProvider.useStorage('translateStorageService');

        $translateProvider.preferredLanguage('fa_IR');
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
    })
    .constant('devConstants', devConstants)
    .service('reportApi', ReportApi)
    .service('branchApi', BranchApi)
    .service('promise', Promise)
    .service('branchThirdPartyApi', BranchThirdPartyApi)
    .service('invoiceApi', InvoiceApi)
    .factory('apiPromise', apiPromise)
    .factory('navigate', navigate)
    .factory('logger', logger)
    .factory('translate', $filter => (key) => $filter('translate')(key))
    .factory('reportParameters', () => ({
        show: () => console.log('reportParameters')
    }))
    .factory('saleApi', saleApi)
    .directive('devTagContent', content)
    .directive('devTagContentBody', body)
    .directive('devTagContentHeading', heading)
    .directive('devTagContentFooter', footer)
    .directive('devTagReportViewer', reportViewer)

    .filter('totalSum', totalSum)

    .controller('reportPrintController', ReportPrintController)
    .controller('invoiceViewController', InvoiceViewController);




