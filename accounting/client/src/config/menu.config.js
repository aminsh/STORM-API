import accModule from "../acc.module";

accModule.config(menuItemsProvider => {
    "use strict";

    let chartOfAccount = [
            {
                title: 'حسابهای کل و معین',
                url: 'general-ledger-accounts'
            },
            {
                title: 'حساب تفصیل',
                url: 'detail-accounts'
            },
            {
                title: 'سطوح',
                url: 'dimensions'
            }
        ],

        journal = [
            {
                title: 'لیست اسناد حسابداری',
                url: 'journals/list',
                icon: ''
            },
            {
                title: 'مدیریت اسناد',
                url: 'journal-management',
                icon: ''
            }
        ],
        banking = [
            {
                title: 'دسته چک ها',
                url: 'cheque-categories',
                icon: ''
            },
            {
                title: 'بانک ها',
                url: 'banks',
                icon: ''
            }
        ],
        reporting = [
            {
                title: 'مرور حساب',
                url: 'account-review',
                icon: ''
            },
            {
                title: 'گزارشات',
                url: 'report/list',
                icon: ''
            }
        ];

    menuItemsProvider
        .add({
            title: 'تنظیمات',
            url: '',
            icon: 'fa fa-gear',
            children: [
                {
                    title: 'دوره های مالی',
                    url: 'fiscal-periods',
                    icon: ''
                },
                {
                    title: 'اطلاعات کسب و کار',
                    url: 'branch-info',
                    icon: ''
                },
                {
                    title: 'پیش فرض',
                    url: 'settings',
                    icon: ''
                },
                {
                    title: 'سرفصل حسابها',
                    url: 'general-ledger-accounts'
                }
            ]
        });

    menuItemsProvider
        .add({
            title: 'تعاریف',
            url: '',
            icon: 'fa fa-info',
            children: [
                {
                    title: 'کالا / خدمات',
                    url: 'products',
                    icon: ''
                },
                {
                    title: 'اشخاص',
                    url: 'people',
                    icon: ''
                },
                {
                    title: 'بانک',
                    url: 'bank',
                    icon: ''
                },
                {
                    title: 'صندوق',
                    url: 'funds',
                    icon: ''
                }
            ]
        });

    menuItemsProvider
        .add({
            title: 'عملیات',
            url: '',
            icon: 'fa fa-hand-pointer-o',
            children: [
                {
                    title: 'انتقال وجه',
                    url: 'transfer-money',
                    icon: ''
                },
                {
                    title: 'ثبت درآمد',
                    url: 'income/create',
                    icon: ''
                },
                {
                    title: 'ثبت هزینه',
                    url: 'expense/create',
                    icon: ''
                }
            ]
        });

    menuItemsProvider
        .add({
            title: 'فهرست',
            url: '',
            icon: 'fa fa-list',
            children: [
                {
                    title: 'فاکتور فروش',
                    url: 'sales/list',
                    icon: ''
                },
                {
                    title: 'فاکتور خرید',
                    url: 'purchases/list',
                    icon: ''
                },
                {
                    title: 'چک های دریافتی',
                    url: 'receivable-cheques',
                    icon: ''
                },
                {
                    title: 'چک های پرداختی',
                    url: 'payable-cheques',
                    icon: 'payable-cheques'
                }
            ]
        });

    menuItemsProvider
        .add({
            title: 'حسابدار',
            url: '',
            icon: 'fa fa-calculator',
            children: [
                ...chartOfAccount,
                ...journal,
                ...banking,
                ...reporting
            ]
        });

});