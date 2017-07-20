

import angular from 'angular';

import 'angular-aria';
import 'angular-messages';
import 'angular-ui-router';
import 'angular-translate';
import 'angular-cookies';
//import 'wow';

import appRoute from './app.route';
import shell from './layout/shell';
import appTranslate from './app.translate';

import authInit from './authentication/init';

import setDirty from './shared/setDirty';
import Promise from './shared/promise';
import Api from './shared/api';
import Logger from './shared/logger';
import translate from './shared/translate';


import LoginController from './authentication/login.controller';
import RegisterController from './authentication/register.controller';
import UserApi from './authentication/api.user';
import ProfileController from './profile/profile.controller';
import SetupInfoController from './branch/setup-info';
import BranchApi from './branch/api.branch';
import uploader from './branch/logo.upload';

angular.module('app', [
    'ngMessages',
    'ui.router',
    'pascalprecht.translate',
    'ngCookies'
])
    .config(appRoute)
    .config(appTranslate)

    .run(authInit)

    .directive('shell', shell)
    .directive('logoUploader', uploader)

    .factory('setDirty', setDirty)
    .factory('translate', translate)
    .service('Promise', Promise)
    .service('Api', Api)
    .service('logger', Logger)


    .controller('LoginController', LoginController)
    .controller('RegisterController', RegisterController)
    .service('userApi', UserApi)

    .controller('ProfileController', ProfileController)

    .controller('SetupInfoController', SetupInfoController)

    .service('branchApi', BranchApi);


export default angular.module('app');
