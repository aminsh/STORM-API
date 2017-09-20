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
import saleApi from "../accounting/client/src/sales/saleApi";
import logger from "../accounting/client/src/services/logger";
import translateStorageService from "../accounting/client/src/services/translateStorageService";
import translate from "../accounting/client/src/services/translate";
import Promise from "../accounting/client/src/services/promise";
import confirm from "../accounting/client/src/services/confirm";
import DocsApi from "../admin/client/docsApi";
import HtmlContent from "./client/htmlContent";
import SpinnerPreloader from "./client/spinnerPreloader";
import DocsSearch from "./client/docsSearch";

// Controllers
import DocsController from './client/docs.controller';
import DocsPageController from './client/docsPage.controller';
import DocsSubjectController from './client/docsSubject.controller';

// Configs
import translateConfig from '../accounting/client/src/config/translate.config';

let docsModule = angular.module('docs.module', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'pascalprecht.translate',
        'lumx'
    ]),
    devConstants = {
        urls: {
            rootUrl: '/docs/api'
        }
    };

docsModule
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
            .state('docs', {
                url: '/',
                controller: 'docsController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/docs.html'
            })
            .state('docsPage', {
                url: '/page/:pageId',
                controller: 'docsPageController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/docsPage.html'
            })
            .state('docsSubject', {
                url: '/subject/:subjectId',
                controller: 'docsSubjectController',
                controllerAs: 'model',
                templateUrl: 'partials/templates/docsSubject.html'
            });

    })
    .constant('devConstants', devConstants)
    .service('formService', formService)
    .service('translate', translate)
    .service('promise', Promise)
    .service('docsApi', DocsApi)
    .factory('apiPromise', apiPromise)
    .factory('navigate', navigate)
    .factory('saleApi', saleApi)
    .factory('logger', logger)
    .factory('translateStorageService', translateStorageService)
    .factory('confirm', confirm)
    .directive('devTagContent', content)
    .directive('devTagContentBody', body)
    .directive('devTagContentHeading', heading)
    .directive('devTagContentFooter', footer)
    .directive('devTagReportViewer', reportViewer)
    .directive('htmlContent', HtmlContent)
    .directive('spinnerPreloader', SpinnerPreloader)
    .directive('docsSearch', DocsSearch)
    .controller('docsController', DocsController)
    .controller('docsPageController', DocsPageController)
    .controller('docsSubjectController', DocsSubjectController);