"use strict";

export default class {

    constructor(apiPromise, promise) {
        this.promise = promise;
        this.apiPromise = apiPromise;
    }

    check(invoiceId){

        return this.promise.create((resolve, reject) => {

            this.apiPromise.get(`/invoice/check/${invoiceId}`)
                .then((exists) => resolve(exists))
                .catch(() => reject(false));

        });

    }

}