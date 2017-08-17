"use strict";

import angular from "angular";
import "array-prototypes";
import "function-prototypes";
import "number-prototypes";
import "string-prototypes";
import "jquery-global-resolve";

// [START] Storm Lumx Dependencies
import "moment";
import "velocity-animate";
import "storm-lumx";
// [-END-] Storm Lumx Dependencies

import "angular-animate";
import "angular-ui-router";
import "angular-sanitize";
import "angular-resource";

import ReportApi from "../accounting/client/src/apis/reportApi";
import apiPromise from "../accounting/client/src/services/apiPromise";
import navigate from "../accounting/client/src/services/routeNavigatorService";
import reportViewer from "../accounting/client/src/directives/reportViewer";
//import ReportPrintController from "../accounting/client/src/report/reportPrint";
import {body, content, footer, heading} from "../accounting/client/src/directives/content";
import BranchApi from "../accounting/client/src/branch/branchApi";
import InvoiceViewController from "./client/invoiceView.controller";
import saleApi from "../accounting/client/src/sales/saleApi";

let invoiceModule = angular.module('invoice.module', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'lumx'
    ]),
    devConstants = {
        urls: {
            rootUrl: '/invoice/api'
        },
        reports: JSON.parse(localStorage.getItem('reports'))
    };

invoiceModule
    .run($rootScope => {
        $rootScope.user = {};
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
                /*,resolve: {
                    loadBranch: (branchApi, $rootScope) => {
                        return branchApi.getCurrent()
                            .then(result => $rootScope.branch = result);
                    }
                }*/
            });
    })
    .constant('devConstants', devConstants)
    .service('reportApi', ReportApi)
    .service('branchApi', BranchApi)
    .factory('apiPromise', apiPromise)
    .factory('navigate', navigate)
    .factory('reportParameters', () => ({
        show: () => console.log('reportParameters')
    }))
    .factory('saleApi', saleApi)
    .directive('devTagContent', content)
    .directive('devTagContentBody', body)
    .directive('devTagContentHeading', heading)
    .directive('devTagContentFooter', footer)
    .directive('devTagReportViewer', reportViewer)
    //.controller('reportPrintController', ReportPrintController)
    .controller('invoiceViewController', InvoiceViewController);




