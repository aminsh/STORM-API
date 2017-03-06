export default function branchApi(apiPromise) {
    "use strict";

    let prefixUrl = '/api/branches';
    return {
        create: branch=> apiPromise.post(`${prefixUrl}`, branch),
        all: ()=> apiPromise.get(`${prefixUrl}`),
        my: ()=> apiPromise.get(`${prefixUrl}/my`),
        addMember: userId => apiPromise.post(`${prefixUrl}/members/add`, {userId: userId}),
        getMembers: ()=> apiPromise.get(`${prefixUrl}/members`),
        changeStateMember: memberId => apiPromise.put(`${prefixUrl}/members/change-state/${memberId}`)
    };
}