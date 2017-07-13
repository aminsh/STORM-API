import accModule from "../acc.module";

function journalTemplateApi(apiPromise, devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {
        create: (data) =>
            apiPromise.post('{0}/journal-templates'.format(urlPrefix),data),
        copy: (id) =>
            apiPromise.post('{0}/journal-templates/{1}/copy'.format(urlPrefix, id)),
        remove: (id) =>
            apiPromise.delete('{0}/journal-templates/{1}'.format(urlPrefix, id))
    };


}

accModule.factory('journalTemplateApi', journalTemplateApi);

