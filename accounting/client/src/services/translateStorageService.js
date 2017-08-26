"use strict";

export default function translateStorageService() {

    return {
        put: (name, value)=> {
            localStorage.setItem('translate.{0}'.format(name), value);
        },
        get: (name)=> {
            return localStorage.getItem('translate.{0}'.format(name));
        }
    }
}
