import swal from 'sweetalert';

export default function logger(translate) {
    return {
        success: function (message) {
            swal({
                title: translate('Successful'),
                text: message || '',
                type: 'success',
                timer: 2000,
                confirmButtonText: translate('OK')
            });
        },
        info: function (message) {
            swal({
                title: translate('Info'),
                text: message,
                type: 'info',
                timer: 2000,
                confirmButtonText: translate('OK')
            });
        },
        warning: function (message) {
            swal({
                title: translate('Warning'),
                text: message,
                type: 'warning',
                timer: 2000,
                confirmButtonText: translate('OK')
            });
        },
        error: function (message) {
            swal({
                title: translate('Error'),
                text: message,
                type: 'error',
                timer: 2000,
                confirmButtonText: translate('OK')
            });
        }
    }
}



