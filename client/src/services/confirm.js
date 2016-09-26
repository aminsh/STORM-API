import swal from 'sweetalert';
import accModule from '../acc.module';

function confirm(translate, $q) {

    return (message, title)=> {
        let deferred = $q.defer();

        swal({
            title: title,
            text: message,
            type: "warning",
            showCancelButton: true,
            cancelButtonText: translate('No'),
            confirmButtonText: translate('Yes')
        }, (isConfirm)=> {
            if (isConfirm) deferred.resolve();
        });

        return deferred.promise;
    }

}

accModule.factory('confirm', confirm);
