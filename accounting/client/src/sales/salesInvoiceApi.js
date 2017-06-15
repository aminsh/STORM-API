import accModule from '../acc.module';

function salesInvoiceApi(apiPromise,devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/sales/`);
        },
        getMaxNumber(){
            return apiPromise.get(`${urlPrefix}/sales/max/number`);
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
        },
        pay: function (id,data) {
            return apiPromise.post(`${urlPrefix}/sales/${id}/pay`,data);
        },
    };


}

accModule.factory('salesInvoiceApi', salesInvoiceApi);
