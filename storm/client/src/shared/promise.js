"use strict";

export default class Promise {
    constructor($q) {
        this.$q = $q;
    }

    create(handler) {
        let deferred = this.$q.defer();

        handler(deferred.resolve, deferred.reject);

        return deferred.promise;
    }
}

Promise.$inject = ['$q'];
