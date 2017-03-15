import Enum from './enumType';
let enums = {};

enums.AccountPostingType = () => {
    return new Enum([
        {key: 'balanceSheet', display: 'تراز نامه ای'},
        {key: 'benefitAndLoss', display: 'سود و زیانی'},
        {key: 'entezami', display: 'انتظامی'}
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
        {key: 'Closing', display: 'اختتامیه'},
        {key: 'FixedAsset', display: 'اموال'},
        {key: 'Payroll', display: 'حقوق'},
        {key: 'Special', display: 'ویژه'}
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

enums.AccMode = () => {
    return new Enum([
        {key: 'Create', display: 'تنظیم اسناد'},
        {key: 'Audit', display: 'رسیدگی اسناد'}
    ]);
};

enums.getMonth = function () {
    return new Enum([
        {key: 1, display: "فروردین"},
        {key: 2, display: "اردیبهشت"},
        {key: 3, display: "خرداد"},
        {key: 4, display: "تیر"},
        {key: 5, display: "مرداد"},
        {key: 6, display: "شهریور"},
        {key: 7, display: "مهر"},
        {key: 8, display: "آبان"},
        {key: 9, display: "آذر"},
        {key: 10, display: "دی"},
        {key: 11, display: "بهمن"},
        {key: 12, display: "اسفند"}
    ]);
};

export default enums;

