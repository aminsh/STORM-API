import accModule from '../acc.module';

function chequeApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {
        getById: function (id) {
            return apiPromise.get('{0}/cheques/{1}'.format(urlPrefix, id));
        },
        getAllWhites: detailAccountId => apiPromise.get(`${urlPrefix}/cheques/detail-account/${detailAccountId}/whites/all`),
        write: (id, data)=> apiPromise.put('{0}/cheques/{1}/write'.format(urlPrefix, id), data)
    };


}

accModule.factory('chequeApi', chequeApi);

