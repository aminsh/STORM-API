import accModule from "../acc.module";

function inventoryApi(apiPromise, devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/products/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/products/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/products`, data);
        },
        update: function (id, data) {
            return apiPromise.put(`${urlPrefix}/${id}/products/`, data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/products/${id}`);
        },
        addToFirstInput(data){
            return apiPromise.post(`${urlPrefix}/inventories/add-to-first-input`, data);
        }
    };


}

accModule.factory('inventoryApi', inventoryApi);
