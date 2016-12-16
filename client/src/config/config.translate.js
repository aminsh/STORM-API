export default function ($translateProvider){
    "use strict";

    let translate = JSON.parse(localStorage.getItem('translate'));

    $translateProvider.translations('fa_IR', translate);
    $translateProvider.preferredLanguage('fa_IR');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    //$translateProvider.useStorage('translateStorageService');
}