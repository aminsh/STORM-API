export default function saleApi(apiPromise, devConstants){

    let urlPrefix = devConstants.urls.rootUrl;

    return {
        getAll(parameters){
            return apiPromise.get(`${urlPrefix}/sales/`, parameters);
        },
        getMaxNumber(){
            return apiPromise.get(`${urlPrefix}/sales/max/number`);
        },
        getById(id) {
            return apiPromise.get(`${urlPrefix}/sales/${id}`);
        },
        create(data) {
            return apiPromise.post(`${urlPrefix}/sales`,data);
        },
        update(id,data) {
            return apiPromise.put(`${urlPrefix}/sales/${id}/`,data);
        },
        remove(id) {
            return apiPromise.delete(`${urlPrefix}/sales/${id}`);
        },
        pay(id,data) {
            return apiPromise.post(`${urlPrefix}/sales/${id}/pay`,data);
        },
        payments(id) {
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
        // [START] SMRSAN
        sendInvoiceEmail(id, email){
            return apiPromise.post(`${urlPrefix}/sales/${id}/send-email`, { email });
        }
        // [-END-] SMRSAN
    };

}
