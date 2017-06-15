import accModule from "../acc.module";

function journalLineApi(apiPromise, devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {
        url: {
            getAll: (journalId) => '{0}/journal-lines/journal/{1}'.format(urlPrefix, journalId)
        },
        getAll(journalId){
            return apiPromise.get(`${urlPrefix}/journal-lines/journal/${journalId}`);
        },
        getById: function (id) {
            return apiPromise.get('{0}/journal-lines/{1}'.format(urlPrefix, id));
        },
        create: function (journalId, data) {
            return apiPromise.post('{0}/journal-lines/journal/{1}'.format(urlPrefix, journalId), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/journal-lines/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/journal-lines/{1}'.format(urlPrefix, id));
        }
    };


}

accModule.factory('journalLineApi', journalLineApi);
