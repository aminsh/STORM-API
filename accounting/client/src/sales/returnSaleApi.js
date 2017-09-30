export default function returnSale(apiPromise, devConstants){

    let urlPrefix = `${devConstants.urls.rootUrl}/return-sales`;

    return {
        getAll(){
            return apiPromise.get(`${urlPrefix}/`);
        },
        getMaxNumber(){
            return apiPromise.get(`${urlPrefix}/max/number`);
        },
        getById(id) {
            return apiPromise.get(`${urlPrefix}/${id}`);
        },
        create(data) {
            return apiPromise.post(urlPrefix,data);
        },
        update(id,data) {
            return apiPromise.put(`${urlPrefix}/${id}/`,data);
        },
        remove(id) {
            return apiPromise.delete(`${urlPrefix}/${id}`);
        },
        pay(id,data) {
            return apiPromise.post(`${urlPrefix}/${id}/pay`,data);
        },
        payments(id) {
            return apiPromise.get(`${urlPrefix}/${id}/payments`);
        }
    };

}
