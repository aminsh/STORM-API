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

import ReportApi from "../accounting/client/src/apis/reportApi";
import apiPromise from "../accounting/client/src/services/apiPromise";
import navigate from "../accounting/client/src/services/routeNavigatorService";
import reportViewer from "../accounting/client/src/directives/reportViewer";
import ReportPrintController from "../accounting/client/src/report/reportPrint";
import {body, content, footer, heading} from "../accounting/client/src/directives/content";
import BranchApi from "../accounting/client/src/branch/branchApi";

let printModule = angular.module('print.module', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ui.router'
    ]),
    devConstants = {
        urls: {rootUrl: '/print/api'},
        reports: JSON.parse(localStorage.getItem('reports'))
    };

printModule
    .run($rootScope => {
        $rootScope.user = {};
    })
    .config(($stateProvider, $urlRouterProvider, $locationProvider) => {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $urlRouterProvider.otherwise('/not-found');

        $stateProvider
            .state('report', {
                url: '/:key',
                controller: 'reportPrintController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/reportPrint.html',
                resolve: {
                    loadBranch: (branchApi, $rootScope) => {
                        return branchApi.getCurrent()
                            .then(result => $rootScope.branch = result);
                    }
                }
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
    .directive('devTagContent', content)
    .directive('devTagContentBody', body)
    .directive('devTagContentHeading', heading)
    .directive('devTagContentFooter', footer)
    .directive('devTagReportViewer', reportViewer)
    .controller('reportPrintController', ReportPrintController);




