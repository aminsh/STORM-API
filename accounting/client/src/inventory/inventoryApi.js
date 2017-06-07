import accModule from '../acc.module';

function inventoryApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/products/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/products/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/products`,data);
        },
        update: function (id,data) {
            return apiPromise.put(`${urlPrefix}/${id}/products/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/products/${id}`);
        }
    };


}

accModule.factory('inventoryApi', inventoryApi);
