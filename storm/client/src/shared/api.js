"use strict";

export default class Api {
    constructor(Promise, $http) {
        this.Promise = Promise;
        this.$http = $http;
    }

    get(url, data) {
        return new this.Promise((resolve, reject) => {
            $http.get(url, {params: data, paramSerializer: '$httpParamSerializerJQLike'})
                .then(function (result) {
                    resolve(result.data);
                })
                .catch(function (error) {
                    console.error(error);
                    reject(['Internal Error']);
                });
        });
    }

    post(url, data) {
        return this.createWriteRequest(this.$http.post(url, data));
    }

    put(url, data) {
        return this.createWriteRequest(this.$http.put(url, data));
    }

    delete(url, data) {
        return this.createWriteRequest(this.$http.delete(url, data));
    }

    createWriteRequest(promise) {
        return this.Promise.create((resolve, reject) => {
            promise.then(function (data) {
                let result = data.data;

                if (result.isValid) {
                    resolve(result.returnValue);
                }
                else {
                    reject(result.errors)
                }
            })
                .catch(function (error) {
                    console.error(error);
                    reject(['Internal Error']);
                });
        });
    }
}

Api.$inject= ['Promise', '$http'];