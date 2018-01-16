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
import 'angular-image-perloader';
import clipboardModule from 'angular-clipboard';

import translate from './services/translate';

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
    'LocalStorageModule',
    'angular-image-preloader',
    clipboardModule.name,
]);

/*accModule.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        Raven.captureException(exception);
    };
});*/
accModule.init = () => {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['acc.module']);
    });
};

accModule.factory('translate', translate);

export default accModule;