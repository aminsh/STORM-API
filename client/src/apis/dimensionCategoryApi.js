import accModule from '../acc.module';

function dimensionCategoryApi(apiPromise) {
    var urlPrefix = '/api';

    return {
        url: {
            getAll: '{0}/dimension-categories'.format(urlPrefix)
        },
        getAll: function () {
            return apiPromise.get('{0}/dimension-categories'.format(urlPrefix));
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
