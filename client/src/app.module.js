import angular from 'angular';
import 'angular-sanitize';
import 'angular-animate';
import 'angular-bootstrap';
import 'angular-route';
import 'angular-translate';
import 'angular-messages';
import 'angular-cookies';

let appModule = angular.module('app.module', [
    'ngAnimate',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'pascalprecht.translate',
    'ngMessages',
    'ngCookies'
]);

appModule.init = () => {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app.module']);
    });
};

export default appModule;