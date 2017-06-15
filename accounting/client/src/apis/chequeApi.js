import accModule from '../acc.module';

function chequeApi(apiPromise, devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {
        getById: function (id) {
            return apiPromise.get('{0}/cheques/{1}'.format(urlPrefix, id));
        },
        getAllWhites: detailAccountId => apiPromise.get(`${urlPrefix}/cheques/detail-account/${detailAccountId}/whites/all`),
        getAllUsed(){
            return apiPromise.get(`${urlPrefix}/cheques/used/all`);
        },
        write(id, data){
            return apiPromise.put(`${urlPrefix}/cheques/${id}/write`, data);
        }
    };
}

accModule.factory('chequeApi', chequeApi);

