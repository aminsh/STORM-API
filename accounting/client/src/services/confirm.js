import swal from 'sweetalert';

export default function confirm(translate, $q) {

    return (message, title, type)=> {
        let deferred = $q.defer();

        swal({
            title: title,
            text: message,
            html: true,
            type: type || "warning",
            showCancelButton: true,
            cancelButtonText: translate('No'),
            confirmButtonText: translate('Yes')
        }, (isConfirm)=> {
            if (isConfirm) deferred.resolve();
        });

        return deferred.promise;
    }

}
