import accModule from '../acc.module';

function salesInvoiceApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/sales/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/sales/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/sales`,data);
        },
        update: function (id,data) {
            return apiPromise.put(`${urlPrefix}/sales/${id}/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/sales/${id}`);
        }
    };


}

accModule.factory('salesInvoiceApi', salesInvoiceApi);
