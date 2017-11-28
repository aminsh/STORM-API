import accModule from "../acc.module";

accModule.config(menuItemsProvider => {
    "use strict";

    let chartOfAccount = [
            {
                title: 'سرفصل حساب ها',
                url: 'general-ledger-accounts'
            },
            {
                title: 'حساب تفصیل',
                url: 'detail-accounts'
            }/*,
            {
                title: 'سطوح',
                url: 'dimensions'
            }*/
        ],

        journal = [
            {
                title: 'لیست اسناد حسابداری',
                url: 'journals/list',
                icon: ''
            }
        ],

        reporting = [
            {
                title: 'مرور حساب',
                url: 'account-review',
                icon: ''
            }
            /*,
            {
                title: 'گزارشات',
                url: 'report/list',
                icon: ''
            }*/
        ];

    menuItemsProvider
        .add({
            title: 'تنظیمات',
            url: 'settings',
            icon: 'fa fa-gear'
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
                    title: 'بانک و صندوق',
                    url: 'banks-and-funds'
                }
            ]
        });

    menuItemsProvider
        .add({
            title: 'انبار',
            url: 'inventory/inputs',
            icon: 'fa fa-cubes'
        });

    menuItemsProvider
        .add({
            title: 'فروش',
            url: 'sale/sales',
            icon: 'fa fa-shopping-cart'
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
            title: 'مدیریت چک',
            url: '',
            icon: 'fa fa-list',
            children: [
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
            title: 'گزارشات',
            url: 'report/list',
            icon: 'fa fa-pie-chart'
        });

    menuItemsProvider
        .add({
            title: 'حسابدار',
            url: '',
            icon: 'fa fa-calculator',
            children: [
                ...chartOfAccount,
                ...journal,
                ...reporting
            ]
        });

});