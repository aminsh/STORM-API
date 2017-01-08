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

let accModule = angular.module('acc.module', [
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'pascalprecht.translate',
    'kendo.directives',
    'ngMessages',
    'ngCookies'
]);

accModule.init = () => {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['acc.module']);
    });
};

export default accModule;