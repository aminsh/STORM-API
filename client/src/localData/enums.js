import Enum from './enumType';
let enums = {};

enums.AccountPostingType = () => {
    return new Enum([
        {key: 'balanceSheet', display: 'تراز نامه ای'},
        {key: 'benefitAndLoss', display: 'سود و زیانی'}
    ]);
};

enums.AccountBalanceType = () => {
    return new Enum([
        {key: 'debit', display: 'بدهکار'},
        {key: 'credit', display: 'بستانکار'}
    ]);
}

enums.AssignmentStatus = () => {
    return new Enum([
        {key: 'Required', display: 'اجباری است'},
        {key: 'NotRequired', display: 'انتخابی است'},
        {key: 'DoesNotHave', display: 'ندارد'}
    ]);
}

enums.JournalType = () => {
    return new Enum([
        {key: 'Opening', display: 'افتتاحیه'},
        {key: 'Closing', display: 'اختتامیه'}
    ]);
}

enums.JournalStatus = () => {
    return new Enum([
        {key: 'Temporary', display: 'موقت'},
        {key: 'BookKeeped', display: 'ثبت دفترداری'},
        {key: 'Fixed', display: 'ثبت قطعی'}
    ]);
};

enums.Active = () => {
    return new Enum([
        {key: true, name: 'showActiveItems', display: 'نمایش فعال ها'},
        {key: false, name: 'showInactiveItems', display: 'نمایش غیر فعال ها'}
    ]);
};

enums.ChequeCategoryStatus = ()=> {
    return new Enum([
        {key: 'Open', display: 'باز'},
        {key: 'Closed', display: 'بسته'}
    ]);
};

export default enums;