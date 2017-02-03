import angular from 'angular';
import 'angular-animate';
import 'angular-bootstrap';
import 'angular-route';
import 'angular-sanitize';
import 'angular-translate';
import 'angular-resource';
import 'angular-messages';
import 'angular-cookies';
import 'kendo';
import 'kendo.culture';
import 'kendo.messages';
import 'angular-cookies';
import 'ADM-dateTimePicker';

Object.defineProperty(Array.prototype, 'toNumber', { enumerable: false });
Object.defineProperty(Array.prototype, 'dtp_toDate', { enumerable: false });

let accModule = angular.module('acc.module', [
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'pascalprecht.translate',
    'kendo.directives',
    'ngMessages',
    'ngCookies',
    'ADM-dateTimePicker'
]);

accModule.init = () => {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['acc.module']);
    });
};

accModule.run((currentService, $cookies) => {
    currentService.setFiscalPeriod(parseInt($cookies.get('current-period')));
    currentService.setMode($cookies.get('current-mode'));
    currentService.setBranch(JSON.parse(localStorage.getItem('currentBranch')));
});

export default accModule;