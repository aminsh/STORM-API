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

enums.PersonType=function(){
    return new Enum([
        {key: 'legal', display: 'حقوقی'},
        {key: 'real', display: 'حقیقی'},
    ]);
};

enums.AccountGroupingType=function(){
    return new Enum([
        {key: '1', display: 'دارایی های جاری'},
        {key: '2', display: 'دارایی های ثابت(غیر جاری)'},
        {key: '3', display: 'بدهی های جاری'},
        {key: '4', display: 'بدهی های بلند مدت'},
        {key: '5', display: 'حقوق صاحبان سهام'},
        {key: '6', display: 'درآمد'},
        {key: '7', display: 'بهای تمام شده کالای فروش رفته و خدمات ارائه شده'},
        {key: '8', display: 'هزینه ها'},
        {key: '9', display: 'خرید'},
        {key: '10', display: 'فروش'},
        {key: '11', display: 'سایر حساب ها'},
    ]);
};

enums.InvoiceType=function(){
    return new Enum([
        {key: 'purchase', display: 'خرید'},
        {key: 'sale', display: 'فروش'},
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

module.exports = enums;