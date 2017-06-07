import accModule from '../acc.module';

function translate($filter) {
    return (key) => $filter('translate')(key);
}

accModule.factory('translate', translate);