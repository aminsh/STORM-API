"use strict";

const Enum = require('../../shared/utilities/Enum'),
    enums = {};

enums.AccountPostingType = function () {
    return new Enum([
        {key: 'balanceSheet', display: 'تراز نامه ای'},
        {key: 'benefitAndLoss', display: 'سود و زیانی'},
        {key: 'entezami', display: 'انتظامی'}
    ]);
};

enums.AccountBalanceType = function () {
    return new Enum([
        {key: 'debit', display: 'بدهکار'},
        {key: 'credit', display: 'بستانکار'}
    ]);
};

enums.DetailAccountType = function () {
    return new Enum([
        {key: 'person', display: 'شخص'},
        {key: 'bank', display: 'بانک'},
        {key: 'fund', display: 'صندوق'}
    ]);
};

enums.PersonType = function () {
    return new Enum([
        {key: 'legal', display: 'حقوقی'},
        {key: 'real', display: 'حقیقی'},
    ]);
};

enums.AccountGroupingType = function () {
    return new Enum([
        {key: '1', display: 'دارایی ها'},
        {key: '2', display: 'بدهی ها'},
        {key: '3', display: 'حقوق صاحبان سهام'},
        {key: '5', display: 'خرید'},
        {key: '6', display: 'فروش'},
        {key: '7', display: 'درآمدها'},
        {key: '8', display: 'هزینه ها'},
        {key: '9', display: 'سایر حساب ها'}
    ]);
};

enums.InvoiceType = function () {
    return new Enum([
        {key: 'purchase', display: 'خرید'},
        {key: 'sale', display: 'فروش'},
        {key: 'returnSale', display: 'برگشت از فروش'},
        {key: 'returnPurchase', display: 'برگشت از خرید'},
    ]);
};

enums.InvoiceStatus = function () {
    return new Enum([
        {key: 'draft', display: 'پیش نویس'},
        {key: 'waitForPayment', display: 'منتظر برای پرداخت'},
        {key: 'paid', display: 'پراخت شده'},
    ]);
};

enums.paymentType = function () {
    return new Enum([
        {key: 'cheque', display: 'چک'},
        {key: 'receipt', display: 'رسید بانکی'},
        {key: 'cash', display: 'نقدی'},
    ]);
};


enums.JournalType = function () {
    return new Enum([
        {key: 'Opening', display: 'افتتاحیه'},
        {key: 'Closing', display: 'اختتامیه'},
        {key: 'FixedAsset', display: 'اموال'},
        {key: 'Payroll', display: 'حقوق'},
        {key: 'Special', display: 'ویژه'}
    ]);
};

enums.JournalStatus = function () {
    return new Enum([
        {key: 'Temporary', display: 'موقت'},
        {key: 'BookKeeped', display: 'ثبت دفترداری'},
        {key: 'Fixed', display: 'ثبت قطعی'}
    ]);
};

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
    ]);
};

enums.AccMode = () => {
    return new Enum([
        {key: 'create', display: 'تنظیم اسناد'},
        {key: 'audit', display: 'رسیدگی اسناد'}
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

enums.Active = () => {
    return new Enum([
        {key: 'true', name: 'showActiveItems', display: 'نمایش فعال ها'},
        {key: 'false', name: 'showInactiveItems', display: 'نمایش غیر فعال ها'}
    ]);
};
enums.ReceivableType = function () {
    return new Enum([
        {key: 'cheque', display: 'چک'},
        {key: 'receipt', display: 'فیش واریزی'},
        {key: 'cash', display: 'نقدی'}
    ])
};

enums.ProductType = function () {
    return new Enum([
        {key: 'good', display: 'کالا'},
        {key: 'service', display: 'خدمات'}
    ]);
};

enums.BranchStatus = function () {
    return new Enum([
        { key: 'pending', display: 'انتظار' },
        { key: 'active', display: 'فعال' }
    ]);
};

enums.cash


module.exports = enums;
