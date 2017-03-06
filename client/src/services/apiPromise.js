export default function apiPromise($http, $q ,translate) {

    function promise($httpPromise) {
        var deferred = $q.defer();

        $httpPromise
            .success(function (result) {
                if (result.isValid) {
                    deferred.resolve(result.returnValue);
                }
                else {
                    deferred.reject(result.errors);
                }
            })
            .error(function (error) {
                console.error(error);
                deferred.reject(['Internal Error']);
            });

        return deferred.promise;
    }

    return {
        get: function (url, data) {
            var deferred = $q.defer();

            $http.get(url, data)
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (error) {
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