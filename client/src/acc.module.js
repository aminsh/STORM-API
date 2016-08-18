import angular from 'angular';
import 'angular-animate';
import 'angular-bootstrap';
import 'angular-route';
import 'angular-sanitize';
import 'angular-translate';
import 'angular-resource';
import 'angular-messages';
import 'kendo';
import 'kendo.messages';

let accModule = angular.module('acc.module', [
    'core.module',
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'pascalprecht.translate',
    'kendo.directives',
    'ngMessages'
]);

accModule.init = () => {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['acc.module']);
    });
};

export default accModule;