import accModule from '../acc.module';

function periodApi(apiPromise) {
    var urlPrefix = '/api';

    return {
        url: {
            getAll: '{0}/periods'.format(urlPrefix)
        }
    };


}

accModule.factory('periodApi', periodApi);

