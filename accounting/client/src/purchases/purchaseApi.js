import accModule from '../acc.module';

function purchaseApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/purchases/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/purchases/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/purchases`,data);
        },
        update: function (data) {
            return apiPromise.put(`${urlPrefix}/purchases/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/purchases/${id}`);
        }
    };


}

accModule.factory('purchasesApi', purchaseApi);
