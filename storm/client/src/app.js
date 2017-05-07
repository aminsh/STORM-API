"use strict";

import angular from 'angular';

//import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-messages';
import 'angular-ui-router';
import 'angular-translate';
import 'angular-cookies';


import appRoute from './app.route';
import shell from './layout/shell';
import appTranslate from './app.translate';

import setDirty from './shared/setDirty';
import Promise from './shared/promise';
import Api from './shared/api';
import Logger from './shared/logger';
import translate from './shared/translate';

import HomeController from './home/home.controller';
import AboutUSController from './ourTeam/aboutus.controller';
import PricingController from './product/pricing.controller';

import LoginController from './authentication/login.controller';
import RegisterController from './authentication/register.controller';
import UserApi from './authentication/api.user';

import ContactUsController from './contactUs/contactUs.controller';
import RequestLucaDemoController from './product/requestLucaDemo.controller';

angular.module('app', [
    'ngMaterial',
    'ngMessages',
    'ui.router',
    'pascalprecht.translate',
    'ngCookies'
])
    .config(appRoute)
    .config(appTranslate)

    .directive('shell', shell)
    .factory('setDirty', setDirty)
    .factory('translate', translate)
    .service('Promise', Promise)
    .service('Api', Api)
    .service('logger', Logger)

    .controller('HomeController', HomeController)
    .controller('HomeController', HomeController)
    .controller('AboutUSController', AboutUSController)
    .controller('PricingController', PricingController)

    .controller('LoginController', LoginController)
    .controller('RegisterController', RegisterController)
    .service('userApi', UserApi)

    .controller('ContactUsController', ContactUsController)
    .controller('RequestLucaDemoController', RequestLucaDemoController);


export default angular.module('app');
