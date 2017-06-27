import accModule from '../acc.module';

function bankAndFundApi(apiPromise,devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {

        summary(){
            return apiPromise.get(`${urlPrefix}/bank-and-fund/summary`);
        }
    };


}

accModule.factory('bankAndFundApi', bankAndFundApi);
