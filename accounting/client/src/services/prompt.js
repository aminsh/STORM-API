import accModule from '../acc.module';
import swal from 'sweetalert';

function prompt(translate, $q) {
    return (option)=> {
        let deferred = $q.defer();

        swal({
            title: option.title,
            text: option.text,
            type: 'input',
            showCancelButton: true,
            closeOnConfirm: false,
            cancelButtonText: translate('Cancel'),
            confirmButtonText: translate('Confirm'),
            showLoaderOnConfirm: true,
            animation: "slide-from-top",
            inputPlaceholder: translate("Type something")
        }, (inputValue)=> {
            if (!inputValue) {
                swal.showInputError(translate('You should type something'));
                return false;
            }

            deferred.resolve(inputValue);
        });

        return deferred.promise;
    }
}

accModule.factory('prompt', prompt);