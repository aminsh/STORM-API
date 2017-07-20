import accModule from '../acc.module';

function saleApi(apiPromise,devConstants) {
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
        payments:function (id) {
            return apiPromise.get(`${urlPrefix}/sales/${id}/payments`);
        },
        summary(){
            return apiPromise.get(`${urlPrefix}/sales/summary`);
        },
        summaryByMonth(){
            return apiPromise.get(`${urlPrefix}/sales/summary/by-month`);
        },
        summaryByProduct(){
            return apiPromise.get(`${urlPrefix}/sales/summary/by-product`);
        },
    };


}

accModule.factory('saleApi', saleApi);
