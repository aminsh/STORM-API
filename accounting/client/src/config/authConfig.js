import accModule from "../acc.module";
import $ from "jquery";

accModule
    .factory('authInterceptor', ($window) => {
        return {
            'request': (config) => {
                return config;
            },
            'response': (response) => {


                return response;
            },
            'requestError': (rejection) => {
                return rejection;
            },
            'responseError': (rejection) => {
                if (rejection.status == 401 && rejection.data == 'user is not authenticated')
                    return $window.location.reload();

                return rejection;
            }
        }
    })
    .config($httpProvider => {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['x-access-token'] = localStorage.getItem('token');

        $httpProvider.interceptors.push('authInterceptor');
    });


$(document).ajaxError((e, response) => {
    if (response.status == 401 && response.responseText == 'user is not authenticated')
        return location.reload();
});

$.ajaxSetup({
    headers: { 'x-access-token': localStorage.getItem('token') }
});
