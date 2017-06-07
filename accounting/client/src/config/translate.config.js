import accModule from '../acc.module';

accModule.config($translateProvider => {
    let translate = JSON.parse(localStorage.getItem('translate'));

    $translateProvider.translations('fa_IR', translate);
    $translateProvider.useStorage('translateStorageService');

    $translateProvider.preferredLanguage('fa_IR');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
});