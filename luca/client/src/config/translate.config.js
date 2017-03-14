import accModule from '../acc.module';
import 'angular-translate-loader-url';
import config from '../localData/config';

accModule.config($translateProvider => {
    if (config.isClientTest()) {
        $translateProvider.useUrlLoader('client/translate.json');
    } else {
        let translate = JSON.parse(localStorage.getItem('translate'));

        $translateProvider.translations('fa_IR', translate);
        $translateProvider.useStorage('translateStorageService');
    }

    $translateProvider.preferredLanguage('fa_IR');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
});