import accModule from '../acc.module';

function showReport() {
    return (url)=> {
        window.open(url, '_blank');
    }
}

accModule.factory('showReport', showReport);