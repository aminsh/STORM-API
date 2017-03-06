export default function userApi(apiPromise) {
    "use strict";
    let prefixUrl = '/api/users';
    return {
        login: (user)=> apiPromise.post(`${prefixUrl}/login`, user),
        logout: ()=> apiPromise.post(`${prefixUrl}/logout`),
        isUniqueEmail: (email)=> apiPromise.get(`${prefixUrl}/is-unique-email/${email}`),
        register: (user)=> apiPromise.post(`${prefixUrl}/register`, user),
        getByEmail: (email) => apiPromise.get(`${prefixUrl}/by-email/${email}`),
        getAuthReturnUrl: ()=> apiPromise.get(`${prefixUrl}/return-url`)
    };
}