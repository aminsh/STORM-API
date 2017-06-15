import accModule from "../acc.module";

function journalTemplateApi(apiPromise, devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {
        create: (journalId, data) =>
            apiPromise.post('{0}/journal-templates/journal/{1}'.format(urlPrefix, journalId), data),
        journalCreate: (id) =>
            apiPromise.post('{0}/journal-templates/{1}/journal/create'.format(urlPrefix, id)),
        remove: (id) =>
            apiPromise.delete('{0}/journal-templates/{1}'.format(urlPrefix, id))
    };


}

accModule.factory('journalTemplateApi', journalTemplateApi);

