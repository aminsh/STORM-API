import accModule from '../acc.module';

function purchasesInvoiceApi(apiPromise) {
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
        update: function (id,data) {
            return apiPromise.put(`${urlPrefix}/purchases/${id}/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/purchases/${id}`);
        }
    };


}

accModule.factory('purchasesInvoiceApi', purchasesInvoiceApi);
