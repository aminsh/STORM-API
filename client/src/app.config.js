import appModule from './app.module';

// load config
import routeConfig from './config/config.route';
import translateConfig from './config/config.translate';
import httpConfig from './config/config.http';
import cookieConfig from './config/config.cookie';

//load controllers
import homeController from './controllers/homeController';
import loginController from './controllers/loginController';
import branchCreateController from './controllers/branchCreateController';
import branchChooseController from './controllers/branchChooseController';


import registerController from './controllers/registerController';
import{matchPassword, uniqueEmail} from './controllers/registerController';
import registerSuccessController from './controllers/registerSuccessController';
import branchAddMemberController from './controllers/branchAddMemberController';
import branchMembersController from './controllers/branchMembersController';

//directives
import shell from './directives/shell';
import content from './directives/content';
import validationSummary from './directives/validationSummary';
import uploader from './directives/uploader';
import contentAlert from './directives/content.alert';
import button from './directives/button';
import tile from './directives/tile';

//services
import apiPromise from './services/apiPromise';
import formService from './services/formService';
import routeNavigatorService from './services/routeNavigatorService';
import logger from './services/logger';
import translate from './services/translate';
import authService from './services/authService';
import branchStateService from './services/branchStateService';

//provider
import settings from './services/settingsProvider';

// load apis
import userApi from './apis/api.user';
import branchApi from './apis/api.branch';

import run from './app.run';

appModule
    .config(routeConfig)
    .config(translateConfig)
    .config(httpConfig)
    .config(cookieConfig)

    .run(run)

    .provider(settings.name, settings)
    .factory(apiPromise.name, apiPromise)
    .factory(formService.name, formService)
    .factory(routeNavigatorService.name, routeNavigatorService)

    .factory(userApi.name, userApi)
    .factory(branchApi.name, branchApi)
    .factory(logger.name, logger)
    .factory(translate.name, translate)
    .factory(authService.name, authService)
    .factory(branchStateService.name, branchStateService)

    .controller(homeController.name, homeController)
    .controller(loginController.name, loginController)
    .controller(registerController.name, registerController)
    .controller(registerSuccessController.name, registerSuccessController)
    .controller(branchCreateController.name, branchCreateController)
    .controller(branchChooseController.name, branchChooseController)
    .controller(branchAddMemberController.name, branchAddMemberController)
    .controller(branchMembersController.name, branchMembersController)

    .directive(matchPassword.name, matchPassword)
    .directive(uniqueEmail.name, uniqueEmail)
    .directive(shell.name, shell)
    .directive(content.name, content)
    .directive(validationSummary.name, validationSummary)
    .directive(uploader.name, uploader)
    .directive(contentAlert.name, contentAlert)
    .directive(button.name, button)
    .directive(tile.name, tile);


// load modals


appModule.init();

