import accModule from '../acc.module';
import $ from 'jquery';

accModule.config($httpProvider=> {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $httpProvider.interceptors.push(()=> {
        return {
            'request': (config)=> {
                return config;
            },
            'response': (response)=> {


                return response;
            },
            'requestError': (rejection)=> {
                return rejection;
            },
            'responseError': (rejection)=> {
                if (rejection.status == 401 && rejection.data == 'user is not authenticated')
                    return location.reload();

                return rejection;
            }
        }
    });
});

$(document).ajaxError((e, response)=> {
    if (response.status == 401 && response.responseText == 'user is not authenticated')
        return location.reload();
});
