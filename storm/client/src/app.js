"use strict";

import angular from 'angular';

import 'angular-aria';
import 'angular-messages';
import 'angular-ui-router';
import 'angular-translate';
import 'angular-cookies';

import 'adm-dtp';

import appRoute from './app.route';
import shell from './layout/shell';
import appTranslate from './app.translate';

import authInit from './authentication/init';

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

import ProfileController from './profile/profile.controller';

import ContactUsController from './contactUs/contactUs.controller';
import RequestLucaDemoController from './product/requestLucaDemo.controller';

import SetupInfoController from './branch/setup-info';
import SetupFirstPeriodController from './branch/setup-firstPeriod';
import SetupChartOfAccountsController from './branch/setup-chartOfAccounts';
import BranchApi from './branch/api.branch';
import FiscalPeriodApi from './branch/api.fiscalPeriod';
import ChartOfAccounts from './branch/api.chartOfAccount';
import uploader from './branch/logo.upload';

angular.module('app', [
    'ngMessages',
    'ui.router',
    'pascalprecht.translate',
    'ngCookies',
    'ADM-dateTimePicker',
])
    .config(appRoute)
    .config(appTranslate)
    .config(function (ADMdtpProvider) {
        ADMdtpProvider.setOptions({
            calType: 'jalali',
            dtpType: 'date',
            format: 'YYYY/MM/DD',
            //default: 'today',
            autoClose: true
        });
    })

    .run(authInit)

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

    .controller('ProfileController', ProfileController)

    .controller('SetupInfoController', SetupInfoController)
    .controller('SetupFirstPeriodController', SetupFirstPeriodController)
    .controller('SetupChartOfAccountsController', SetupChartOfAccountsController)
    .service('branchApi', BranchApi)
    .service('fiscalPeriodApi', FiscalPeriodApi)
    .service('chartOfAccountApi', ChartOfAccounts)
    .directive('logoUploader', uploader)

    .controller('ContactUsController', ContactUsController)
    .controller('RequestLucaDemoController', RequestLucaDemoController);


export default angular.module('app');
