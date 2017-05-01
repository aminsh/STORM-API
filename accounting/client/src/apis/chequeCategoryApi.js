import accModule from '../acc.module';

function chequeCategoryApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {
        getOpens: detailAccountId =>
            apiPromise.get(`${urlPrefix}/cheque-categories/detail-account/${detailAccountId}/opens`),
        getById: function (id) {
            return apiPromise.get('{0}/cheque-categories/{1}'.format(urlPrefix, id));
        },
        create: function (data) {
            return apiPromise.post('{0}/cheque-categories'.format(urlPrefix), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/cheque-categories/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/cheque-categories/{1}'.format(urlPrefix, id));
        }
    };


}

accModule.factory('chequeCategoryApi', chequeCategoryApi);
