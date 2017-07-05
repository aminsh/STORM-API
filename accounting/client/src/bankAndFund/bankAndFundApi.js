import accModule from '../acc.module';

function bankAndFundApi(apiPromise,devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {

        all(){
            return apiPromise.get(`${urlPrefix}/bank-and-fund`);
        },

        summary(){
            return apiPromise.get(`${urlPrefix}/bank-and-fund/summary`);
        }
    };


}

accModule.factory('bankAndFundApi', bankAndFundApi);
