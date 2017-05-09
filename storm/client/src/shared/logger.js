"use strict";

import swal from 'sweetalert';

export default class Logger {
    constructor(translate, Promise) {
        this.translate = translate;
        this.Promise = Promise;
    }

    success(title, message) {
        return this.Promise.create((resolve, reject) => {
            let translate = this.translate;

            swal({
                title,
                text: message,
                type: 'success',
                confirmButtonText: translate('OK')
            }, function () {
                resolve();
            });
        });
    }

    info(message) {
        let translate = this.translate;

        swal({
            title: translate('Info'),
            text: message,
            type: 'info',
            timer: 2000,
            confirmButtonText: translate('OK')
        });
    }

    warning(message) {
        let translate = this.translate;

        swal({
            title: translate('Warning'),
            text: message,
            type: 'warning',
            timer: 2000,
            confirmButtonText: translate('OK')
        });
    }

    error(message) {
        let translate = this.translate;

        swal({
            title: translate('Error'),
            text: message,
            type: 'error',
            timer: 4000,
            confirmButtonText: translate('OK')
        });
    }
}

Logger.$inject = ['translate','Promise'];