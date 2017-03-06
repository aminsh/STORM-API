import angular from 'angular';

import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-messages';
import 'angular-ui-router';

/*import '../style/app.css';
 import '../../node_modules/angular-material/angular-material.min.css';*/

import routing from './routing';
import toolbar from './directives/toolbar';
import shell from './directives/shell';
import dynamicMessages from './directives/dynamicMessages';
import api from './services/api';
import setDirty from './services/setDirty';
import HomeController from './home/home.controller';
import AboutUSController from './home/aboutus.controller';
import PricingController from './home/pricing.controller';
import LoginController from './auth/login.controller';
import RegisterController from './auth/register.controller';

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['ngMaterial', 'ngMessages', 'ui.router'])
    .config(routing)
    .factory('api', api)
    .factory('setDirty', setDirty)
    .directive('toolbar', toolbar)
    .directive('shell', shell)
    .directive('dynamicMessages', dynamicMessages)
    .controller('HomeController', HomeController)
    .controller('AboutUSController', AboutUSController)
    .controller('PricingController', PricingController)
    .controller('LoginController', LoginController)
    .controller('RegisterController', RegisterController)

export default MODULE_NAME;
