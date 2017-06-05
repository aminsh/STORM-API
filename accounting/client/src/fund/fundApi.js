import accModule from '../acc.module';

function fundApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/funds/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/funds/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/funds`,data);
        },
        update: function (id,data) {
            return apiPromise.put(`${urlPrefix}/funds/${id}/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/funds/${id}`);
        }
    };


}

accModule.factory('fundApi', fundApi);
