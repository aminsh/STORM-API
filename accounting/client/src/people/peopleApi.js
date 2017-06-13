import accModule from '../acc.module';

function peopleApi(apiPromise) {
    var urlPrefix = '/api/v1';

    return {

        getAll(){
            return apiPromise.get(`${urlPrefix}/people/`);
        },
        getById: function (id) {
            return apiPromise.get(`${urlPrefix}/people/${id}`);
        },
        create: function (data) {
            return apiPromise.post(`${urlPrefix}/people`,data);
        },
        update: function (id,data) {
            return apiPromise.put(`${urlPrefix}/people/${id}/`,data);
        },
        remove: function (id) {
            return apiPromise.delete(`${urlPrefix}/people/${id}`);
        }
    };


}

accModule.factory('peopleApi', peopleApi);
