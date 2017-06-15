import accModule from '../acc.module';

function bankApi(apiPromise,devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/banks/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/banks/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/banks`,data);
        },
        update: function (id,data) {
            return apiPromise.put(`${urlPrefix}/banks/${id}/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/banks/${id}`);
        }
    };


}

accModule.factory('bankApi', bankApi);
