import accModule from '../acc.module';

function purchaseApi(apiPromise,devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/purchases/`);
        },
        getMaxNumber(){
            return apiPromise.get(`${urlPrefix}/purchases/max/number`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/purchases/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/purchases`,data);
        },
        update: function (id,data) {
            return apiPromise.put(`${urlPrefix}/purchases/${id}/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/purchases/${id}`);
        },
        pay: function (id,data) {
            return apiPromise.post(`${urlPrefix}/purchases/${id}/pay`,data);
        },
        payments:function (id) {
            return apiPromise.get(`${urlPrefix}/purchases/${id}/payments`);
        },
        summary(){
            return apiPromise.get(`${urlPrefix}/purchases/summary`);
        },
        generateJournal(id){
            return apiPromise.post(`${urlPrefix}/purchases/${id}/generate-journal`);
        }
    };


}

accModule.factory('purchaseApi', purchaseApi);
