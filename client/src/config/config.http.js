export default function ($httpProvider){
    "use strict";

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

}