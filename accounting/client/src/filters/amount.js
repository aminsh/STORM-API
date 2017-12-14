import accModule from '../acc.module';

function amount($filter) {
    return (input)=> {
        if (!input)
            return 0;

        let isNegative = input < 0,
            value = Math.abs(input),
            formattedNumber = $filter('number')(value);

            return isNegative ? `(${formattedNumber})` : formattedNumber;
    }
}

function digtToWord() {
    return window.digitToWord;
}
accModule.filter('amount', amount);

accModule.filter('digitToWord', digtToWord)