import accModule from '../acc.module';

function apiPromise($http, $q) {

    function promise($httpPromise) {
        var deferred = $q.defer();

        $httpPromise
            .then(function (data) {
                let result = data.data;

                if (result.isValid) {
                    deferred.resolve(result.returnValue);
                }
                else {
                    deferred.reject(result.errors)
                }
            })
            .catch(function (error) {
                console.error(error);
                deferred.reject(['Internal Error']);
            });

        return deferred.promise;
    }

    return {
        get: function (url, data) {
            var deferred = $q.defer();

            $http.get(url, {params: data, paramSerializer: '$httpParamSerializerJQLike'})
                .then(function (result) {
                    deferred.resolve(result.data);
                })
                .catch(function (error) {
                    console.error(error);
                    deferred.reject(['Internal Error']);
                });

            return deferred.promise;
        },
        post: function (url, data) {
            return promise($http.post(url, data));
        },
        put: function (url, data) {
            return promise($http.put(url, data));
        },
        delete: function (url, data) {
            return promise($http.delete(url, data));
        }
    };
}

accModule.factory('apiPromise', apiPromise)