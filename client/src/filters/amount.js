import accModule from '../acc.module';

function amount() {
    return (input)=> {
        if (!input)
            return '';

        return kendo.toString(input, 'n0');
    }
}

function digtToWord() {
    return window.digitToWord;
}
accModule.filter('amount', amount);

accModule.filter('digitToWord', digtToWord)