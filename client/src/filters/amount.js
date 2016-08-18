import accModule from '../acc.module';

function amount() {
    return (input)=> {
        if (!input)
            return '';

        return kendo.toString(input, 'n0');
    }
}

accModule.filter('amount', amount);