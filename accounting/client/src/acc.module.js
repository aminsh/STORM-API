import angular from 'angular';
import 'angular-animate';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import 'angular-sanitize';
import 'angular-translate';
import 'angular-resource';
import 'angular-messages';
import 'angular-cookies';
import 'angular-chart';
import 'angular-ladda';
import 'angular-ui-select';
import 'angular-local-storage';

import 'adm-dtp';
import 'chart.js';

Object.defineProperty(Array.prototype, 'toNumber', { enumerable: false });
Object.defineProperty(Array.prototype, 'dtp_toDate', { enumerable: false });

let accModule = angular.module('acc.module', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
    'pascalprecht.translate',
    'ngMessages',
    'ngCookies',
    'ADM-dateTimePicker',
    'chart.js',
    'angular-ladda',
    'ui.select',
    'LocalStorageModule'
]);

accModule.init = () => {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['acc.module']);
    });
};

accModule.run((currentService, $cookies, $rootScope) => {
    currentService.setToday(localStorage.getItem('today'));
    currentService.setFiscalPeriod(parseInt($cookies.get('current-period')));
    currentService.setMode($cookies.get('current-mode'));
    currentService.setBranch(JSON.parse(localStorage.getItem('currentBranch')));

    $rootScope.canShowStatusSection = false;
    $rootScope.isDevelopment = localStorage.getItem('env') == 'development';
});

export default accModule;