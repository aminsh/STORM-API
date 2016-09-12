import accModule from '../acc.module';

function chequeApi(apiPromise) {
    var urlPrefix = '/api';

    return {
        getById: function (id) {
            return apiPromise.get('{0}/cheques/{1}'.format(urlPrefix, id));
        }
    };


}

accModule.factory('chequeApi', chequeApi);

