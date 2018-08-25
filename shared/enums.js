"use strict";

const enums = {};

class Enum {
    constructor(enums) {
        this.data = enums;
    }

    getDisplay(key) {
        if (!key) return '';

        return this.data
            .asEnumerable()
            .single(e => e.key == key)
            .display;
    }

    getKey(key) {
        return this.data
            .asEnumerable()
            .single(e => e.key == key);
    }

    getKeys() {
        return this.data.asEnumerable()
            .select(e => e.key)
            .toArray();
    }
}

enums.AccountPostingType = function () {
    return new Enum([
        {key: 'balanceSheet', display: 'تراز نامه ای (دائمی)'},
        {key: 'benefitAndLoss', display: 'سود و زیانی (موقت)'},
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

enums.AssignmentStatus = function () {
    return new Enum([
        {key: 'Required', display: 'اجباری است'},
        {key: 'NotRequired', display: 'انتخابی است'},
        {key: 'DoesNotHave', display: 'ندارد'}
    ]);
};

enums.ErrorCode = function () {
    return new Enum([
        {key: 'SaveDataError', display: '-1'},
        {key: 'NoRecordFound', display: '-2'},
        {key: 'RecordIsUsed', display: '-3'},
        {key: 'DeleteError', display: '-4'},
        {key: 'InputDataNotFound', display: '-5'},
        {key: 'EditError', display: '-6'},
        {key: 'DataNotFound', display: '-7'},
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

        //TODO they should be removed after purchase and returnInvoice code changed
        {key: 'waitForPayment', display: 'منتظر برای پرداخت'},
        {key: 'paid', display: 'پرداخت شده'},
        //*************************************************************************

        {key: 'confirmed', display: 'تایید'},
        {key: 'fixed', display: 'قطعی'},
    ]);
};

enums.paymentType = function () {
    return new Enum([
        {key: 'cheque', display: 'چک'},
        {key: 'receipt', display: 'رسید بانکی'},
        {key: 'cash', display: 'نقدی'},
        {key: 'person', display: 'شخص'}
    ]);
};

enums.OrderStatus = function () {
    return new Enum([
        {key: 'waitForPayment', display: 'منتظر برای پرداخت'},
        {key: 'paid', display: 'پرداخت شده'}
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
        {key: 'Cancel', display: 'باطل'},
        {key: 'Passed', display: 'پاس شده'}
    ]);
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

enums.getSeason = function () {
    return new Enum([
        {key: 1, display: "بهار"},
        {key: 2, display: "تابستان"},
        {key: 3, display: "پاییز"},
        {key: 4, display: "زمستان"}
    ]);
};

enums.getVatIncluded = function () {
    return new Enum([
        {key: 1, display: "همه ی فاکتورها"},
        {key: 2, display: "شامل فاکتورهای با مالیات"},
        {key: 3, display: "شامل فاکتورهای بدون مالیات"}
    ]);
};

enums.getNationalCodeIncluded = function () {
    return new Enum([
        {key: 1, display: "همه ی اشخاص"},
        {key: 2, display: "شامل اشخاص دارای کد ملی/ شناسه"},
        {key: 3, display: "شامل اشخاص بدون کد ملی/ شناسه"}
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
        {key: 'pending', display: 'انتظار'},
        {key: 'active', display: 'فعال'}
    ]);
};

enums.InventoryType = function () {
    return new Enum([
        {key: 'input', display: 'رسید'},
        {key: 'output', display: 'حواله'}
    ]);
};

enums.InventoryIOType = function () {
    return new Enum([
        {key: 'inputFirst', display: 'اول دوره'},
        {key: 'inputPurchase', display: 'خرید'},
        {key: 'inputStockToStock', display: 'انبار به انبار'},
        {key: 'inputBackFromSaleOrConsuming', display: 'برگشت از مصرف / فروش'},

        {key: 'outputSale', display: 'فروش'},
        {key: 'outputWaste', display: 'ضایعات'},
        {key: 'outputStockToStock', display: 'انبار به انبار'},
        {key: 'outputReturnPurchase', display: 'برگشت از خرید'}
    ])
};

enums.ReceiveOrPay = function () {
    return new Enum([
        {key: 'receive', display: 'دریافت'},
        {key: 'pay', display: 'پرداخت'},
    ]);
};

enums.UserRole = function () {
    return new Enum([
        {key: 'admin'},
        {key: 'customer'}
    ]);
};

enums.ThirdParty = function () {
    return new Enum([
        {
            key: "payping",
            type: "paymentGateway",
            data: {
                website: 'https://www.payping.ir',
                title: "پی پینگ",
                logo: "payping-logo.png",
                display: "سرویس پرداخت پی پینگ",
                description: "با استفاده از این افزونه، مشتریان شما می توانند صورت حساب شما را پرداخت کنند و اسناد مالی مربوطه به صورت اتوماتیک صادر می شود."
            }
        },
        {
            key: "zarinpal",
            type: "paymentGateway",
            data: {
                website: 'https://www.zarinpal.com',
                title: "زرین پال",
                logo: "zarinpal-logo.svg",
                display: "درگاه پرداخت زرین‌پال",
                description: "با استفاده از این افزونه، مشتریان شما می توانند صورت حساب شما را پرداخت کنند و اسناد مالی مربوطه به صورت اتوماتیک صادر می شود."
            }
        }
    ]);
};

enums.ProductOutputCreationMethod = function () {
    return new Enum([
        {key: 'defaultStock', display: 'انبار پیش فرض'},
        {key: 'stockOnRequest', display: 'انتخاب انبار در فاکتور فروش'}

        /*
        * these are not implemented
        */
        /*{key: 'stockListOnRequest', display: 'انتخاب لیست انبارها در فاکتور فروش'},
        {key: 'byPriority', display: 'براساس اولویت بندی انبارها'},
        {key: 'byProductCategory', display: 'براساس گروه کالایی'}*/
    ]);
};

enums.JournalGenerationTemplateSourceType = function () {
    return new Enum([
        {key: 'sale', display: 'فاکتور فروش'},
        {key: 'purchase', display: 'فاکتور خرید'},
        {key: 'returnSale', display: 'فاکتور برگشت از فروش'},
        {key: 'inventoryOutputSale', display: 'حواله فروش'},
        {key: 'inventoryInputReturnSale', display: 'رسید برگشت از فروش'},
        {key: 'returnPurchase', display: 'فاکتور برگشت از خرید'}
    ]);
};

enums.NotificationEvent = function () {
    return new Enum([
        {
            key: 'onInventoryInputChanged',
            display: 'تغییر در ورودی های کالا',
            fields: [
                {key: 'productId', display: 'کالا #'},
                {key: 'quantity', display: 'مقدار موجودی'}
            ]
        }
    ]);
};

enums.getInventoryFixedStatus = function () {
    return new Enum([
        {key: 'all', display: "همه ی گردش ها"},
        {key: 'fixedQuantity', display: "گردش های ثبت مقداری شده"},
        {key: 'fixedAmount', display: "گردش های ثبت ریالی شده"},
        {key: 'fixedAmountAndQuantity', display: "گردش های ثبت مقداری و ریالی شده"}
    ]);
};

enums.ReceiveChequeStatus = function () {
    return new Enum([
        {key: 'inProcessOnPassing', display: 'در جریان وصول'},
        {key: 'passed', display: 'وصول'},
        {key: 'inFund', display: 'نزد صندوق'},
        {key: 'revocation', display: 'ابطال'},
        {key: 'missing', display: 'مفقود/ سرقت'},
        {key: 'spend', display: 'انتقال/ خرج'},
        {key: 'return', display: 'برگشت'}

    ]);
};

enums.TreasuryReceiveDocumentTypes = function () {
    return new Enum([
        {key: 'cheque', display: "چک"},
        {key: 'cash', display: "نقدی"},
        {key: 'receipt', display: "واریزی"},
        {key: 'demandNote', display: "سفته"}
    ])
};

enums.TreasuryPaymentDocumentTypes = function () {
    return new Enum([
        {key: 'cheque', display: "چک"},
        {key: 'cash', display: "نقدی"},
        {key: 'receipt', display: "فیش واریزی"},
        {key: 'demandNote', display: "سفته"},
        {key: 'spendCheque', display: "واگذاری چک"}
    ])
};

enums.TreasuryType = function () {
    return new Enum([
        {key: 'receive', display: "دریافتی"},
        {key: 'payment', display: "پرداختی"},
        {key: 'transfer', display: "انتقالی"},
    ])
};

enums.Features = function () {
    return new Enum([
        {key: 'sale', value: ['sales', 'return-sales', 'products', 'product-categories', 'scales'], display: 'فروش'},
        {key: 'purchase', value: ['purchases', 'return-purchase', 'products', 'product-categories', 'scales'], display: 'خرید'},
        {
            key: 'inventory',
            display: 'انبار',
            value: ['inventories', 'stocks', 'inventory-io-types', 'products', 'product-categories', 'scales']
        },
        {
            key: 'journal',
            display: 'دفترداری',
            value: [
                'journals',
                'account-review',
                'detail-accounts',
                'detail-account-categories',
                'dimensions',
                'dimension-categories',
                'general-ledger-accounts',
                'journal-templates',
                'subsidiary-ledger-accounts',
                'journal-generation-templates',
                'tags'
            ]
        },
        {key: 'treasury', value: ['treasury', 'banks-name', 'cheque-categories', 'funds', 'banks', 'bank-and-fund'], display: 'خزانه داری'},
        {key: 'other', value: ['reports', 'people', 'settings', 'fiscal-periods', 'permissions', 'third-party']}
    ]);
};

enums.PersonRole = function () {
    return new Enum([
        {key: 'marketer', display: "بازاریاب"},
        {key: 'buyer', display: "خریدار"},
        {key: 'seller', display: "فروشنده"},
        {key: 'employee', display: "پرسنل"},
        {key: 'stackHolder', display: "سهامدار"},
        {key: 'stockKeeper', display: "انباردار"}
    ])
};

module.exports = enums;
