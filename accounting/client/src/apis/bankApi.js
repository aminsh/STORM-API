import accModule from '../acc.module';

function bankApi(apiPromise, devConstants) {
    let urlPrefix = devConstants.urls.rootUrl;

    return {
        getAll(){
            return apiPromise.get(`${urlPrefix}/banks`);
        },
        getById: function (id) {
            return apiPromise.get('{0}/banks/{1}'.format(urlPrefix, id));
        },
        create: function (data) {
            return apiPromise.post('{0}/banks'.format(urlPrefix), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/banks/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/banks/{1}'.format(urlPrefix, id));
        }
    };


}

accModule.factory('bankApi', bankApi);
