var Enum = require('../utilities/Enum');
var enums = {};

enums.AccountPostingType = function () {
    return new Enum([
        {key: 'balanceSheet', display: 'تراز نامه ای'},
        {key: 'benefitAndLoss', display: 'سود و زیانی'}
    ]);
};

enums.AccountBalanceType = function () {
    return new Enum([
        {key: 'debit', display: 'بدهکار'},
        {key: 'credit', display: 'بستانکار'}
    ]);
};

enums.AssignmentStatus = function () {
    return new Enum([
        {key: 'Required', display: 'اجباری است'},
        {key: 'NotRequired', display: 'انتخابی است'},
        {key: 'DoesNotHave', display: 'ندارد'}
    ]);
};

enums.JournalType = function () {
    return new Enum([
        {key: 'Opening', display: 'افتتاحیه'},
        {key: 'Closing', display: 'اختتامیه'}
    ]);
};

enums.JournalStatus = function () {
    return new Enum([
        {key: 'Temporary', display: 'موقت'},
        {key: 'BookKeeped', display: 'ثبت دفترداری'},
        {key: 'Fixed', display: 'ثبت قطعی'}
    ]);
}

enums.ChequeStatus = function () {
    return new Enum([
        {key: 'White', display: 'سفید'},
        {key: 'Used', display: 'استفاده شده'},
        {key: 'Cancel', display: 'باطل'}
    ])
};

enums.ChequeCategoryStatus = function () {
    return new Enum([
        {key: 'Open', display: 'باز'},
        {key: 'Closed', display: 'بسته'}
    ])
};

module.exports = enums;