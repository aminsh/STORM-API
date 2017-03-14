import accModule from '../acc.module';

function dimensionCategoryApi(apiPromise, $q, $timeout) {
    var urlPrefix = '/api';

    return {
        url: {
            getAll: '{0}/dimension-categories'.format(urlPrefix)
        },
        getAll: function () {
            return apiPromise.get('{0}/dimension-categories'.format(urlPrefix));
        },
        getAllLookup: ()=> {
            let deferred = $q.defer();
            let dimensionCategories = JSON.parse(localStorage.getItem('dimensionCategories'));

            if (dimensionCategories)
                $timeout(()=> deferred.resolve(dimensionCategories), 0);
            else apiPromise.get('{0}/dimension-categories'.format(urlPrefix))
                .then((result)=> {
                    localStorage.setItem('dimensionCategories', JSON.stringify(result));
                    deferred.resolve(result)
                });

            return deferred.promise;
        },
        getById: function (id) {
            return apiPromise.get('{0}/dimension-categories/{1}'.format(urlPrefix, id));
        },
        create: function (data) {
            return apiPromise.post('{0}/dimension-categories'.format(urlPrefix), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/dimension-categories/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/dimension-categories/{1}'.format(urlPrefix, id));
        },
        activate: function (id) {
            return apiPromise.put('{0}/dimension-categories/{1}/activate'.format(urlPrefix, id));
        },
        deactivate: function (id) {
            return apiPromise.put('{0}/dimension-categories/{1}/deactivate'.format(urlPrefix, id));
        }
    };


}

accModule.factory('dimensionCategoryApi', dimensionCategoryApi);
