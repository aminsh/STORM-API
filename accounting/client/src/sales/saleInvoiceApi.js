import accModule from '../acc.module';

function salesInvoiceApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/sale/invoices/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/sale/invoices/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/sale/invoices`,data);
        },
        update: function (data) {
            return apiPromise.put(`${urlPrefix}/sale/invoices/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/sale/invoices/${id}`);
        }
    };


}

accModule.factory('salesInvoiceApi', salesInvoiceApi);
