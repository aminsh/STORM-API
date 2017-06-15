import accModule from "../acc.module";

function journalApi(apiPromise, devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {
        url: {
            getAll: '{0}/journals'.format(urlPrefix)
        },
        getGroupedByMouth: () => apiPromise.get('{0}/journals/summary/grouped-by-month'.format(urlPrefix)),
        getById: function (id) {
            return apiPromise.get('{0}/journals/{1}'.format(urlPrefix, id));
        },
        getByNumber: (number) => apiPromise.get(`${urlPrefix}/journals/by-number/${number}`),
        getMaxNumber(){
            return apiPromise.get(`${urlPrefix}/journals/max-number`);
        },
        getTotalInfo: () => apiPromise.get(`${urlPrefix}/journals/total-info`),
        getJournalReportJson: id => apiPromise.get(`/report/json/journal/${id}`),
        create: function (data) {
            return apiPromise.post('{0}/journals'.format(urlPrefix), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/journals/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/journals/{1}'.format(urlPrefix, id));
        },
        copy: (id) => apiPromise.post('{0}/journals/{1}/copy'.format(urlPrefix, id)),
        bookkeeping: (id, data) => apiPromise.put('{0}/journals/{1}/bookkeeping'.format(urlPrefix, id), data),
        attachImage: (id, data) => apiPromise.put('{0}/journals/{1}/attach-image'.format(urlPrefix, id), data),
        incomesAndOutcomes: () => apiPromise.get(`${urlPrefix}/account-review/incomes-outcomes`),
        getPayablesNotHaveChequeLines(detailAccountId){
            return apiPromise.get(`${urlPrefix}/journals/${detailAccountId}/payable-transactions/not-have-cheque`);
        }
    };
}

accModule.factory('journalApi', journalApi);
