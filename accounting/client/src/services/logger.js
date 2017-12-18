import swal from "sweetalert";

export default function logger(translate) {
    return {
        alert(item){
            swal(item);
        },
        close(){
            swal.close();
        },
        success: function (message) {
            swal({
                title: translate('Successful'),
                text: message || translate('Done successfully'),
                html: true,
                type: 'success',
                timer: 2000,
                confirmButtonText: translate('OK')
            });
        },
        info: function (message) {
            swal({
                title: translate('Info'),
                text: message,
                html: true,
                type: 'info',
                timer: 2000,
                confirmButtonText: translate('OK')
            });
        },
        warning: function (message) {
            swal({
                title: translate('Warning'),
                text: message,
                html: true,
                type: 'warning',
                timer: 2000,
                confirmButtonText: translate('OK')
            });
        },
        error: function (message) {
            swal({
                title: translate('Error'),
                text: message,
                html: true,
                type: 'error',
                timer: 4000,
                confirmButtonText: translate('OK')
            });
        }
    }
}



