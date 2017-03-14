import accModule from '../acc.module';

function dimensionApi(apiPromise, $q, $timeout) {
    var urlPrefix = '/api';

    return {
        url: {
            getAll: function (parentId) {
                return '{0}/dimensions/category/{1}'.format(urlPrefix, parentId);
            }
        },
        getAll: function () {
            return apiPromise.get('{0}/dimensions'.format(urlPrefix));
        },
        getById: function (id) {
            return apiPromise.get('{0}/dimensions/{1}'.format(urlPrefix, id));
        },
        create: function (categoryId, data) {
            return apiPromise.post('{0}/dimensions/category/{1}'.format(urlPrefix, categoryId), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/dimensions/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/dimensions/{1}'.format(urlPrefix, id));
        },
        activate: function (id) {
            return apiPromise.put('{0}/dimensions/{1}/activate'.format(urlPrefix, id));
        },
        deactivate: function (id) {
            return apiPromise.put('{0}/dimensions/{1}/deactivate'.format(urlPrefix, id));
        }
    };


}

accModule.factory('dimensionApi', dimensionApi);
