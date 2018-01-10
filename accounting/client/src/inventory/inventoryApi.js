import accModule from "../acc.module";

function inventoryApi(apiPromise, devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {

        getAll() {
            return apiPromise.get(`${urlPrefix}/inventories/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/inventories/${id}`);
        },
        getProductInventoryByStock(productId) {
            return apiPromise.get(`${urlPrefix}/inventories//by-stock/${productId}`);
        },
        getInputMaxNumber(){
            return apiPromise.get(`${urlPrefix}/inventories/inputs/max-number`);
        },
        getOutputMaxNumber(){
            return apiPromise.get(`${urlPrefix}/inventories/outputs/max-number`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/products`, data);
        },
        update: function (id, data) {
            return apiPromise.put(`${urlPrefix}/${id}/products/`, data);
        },

        createInput(data){
            return apiPromise.post(`${urlPrefix}/inventories/inputs`, data);
        },

        updateInput(id, data){
            return apiPromise.put(`${urlPrefix}/inventories/inputs/${id}`, data);
        },

        createOutput(data){
            return apiPromise.post(`${urlPrefix}/inventories/outputs`, data);
        },

        updateOutput(id, data){
            return apiPromise.put(`${urlPrefix}/inventories/outputs/${id}`, data);
        },

        removeInput(id){
            return apiPromise.delete(`${urlPrefix}/inventories/inputs/${id}`);
        },

        removeOutput(id){
            return apiPromise.delete(`${urlPrefix}/inventories/outputs/${id}`);
        },

        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/products/${id}`);
        },
        addToFirstInput(id ,data) {
            return apiPromise.post(`${urlPrefix}/products/${id}/add-to-input-first`, data);
        },
        inputSetPrice(id, data){
            return apiPromise.put(`${urlPrefix}/inventories/inputs/${id}/set-price`, data);
        },
        fixQuantity: id => apiPromise.put(`${urlPrefix}/inventories/inputs/${id}/fix-quantity`)
    };


}

accModule.factory('inventoryApi', inventoryApi);
