"use strict";

export default function(apiPromise,devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

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
        },
        summary:function (id) {
            return apiPromise.get(`${urlPrefix}/people/${id}/summary/sale/by-month`);
        }
    };


};
