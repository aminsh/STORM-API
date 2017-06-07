import accModule from '../acc.module';


function translateStorageService() {

    return {
        put: (name, value)=> {
            localStorage.setItem('translate.{0}'.format(name), value);
        },
        get: (name)=> {
            return localStorage.getItem('translate.{0}'.format(name));
        }
    }
}

accModule.factory('translateStorageService', translateStorageService);