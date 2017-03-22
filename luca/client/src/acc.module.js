import angular from 'angular';
import 'angular-animate';
import 'angular-bootstrap';
import 'angular-route';
import 'angular-sanitize';
import 'angular-translate';
import 'angular-resource';
import 'angular-messages';
import 'angular-cookies';
import 'angular-cookies';
import 'ADM-dateTimePicker';

import 'chart.js';
import 'angular-chart';

import 'angular-ladda';

Object.defineProperty(Array.prototype, 'toNumber', { enumerable: false });
Object.defineProperty(Array.prototype, 'dtp_toDate', { enumerable: false });

let accModule = angular.module('acc.module', [
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'pascalprecht.translate',
    'ngMessages',
    'ngCookies',
    'ADM-dateTimePicker',
    'chart.js',
    'angular-ladda'
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
});

export default accModule;