import accModule from '../acc.module';

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

        overcome = [
            {
                title: 'فاکتور فروش',
                url: 'sales/list',
                icon: ''
            }
        ],

        cost = [
            {
                title: 'فاکتور خرید',
                url: 'purchases/list',
                icon: ''
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
                }
            ]
        });

    menuItemsProvider
        .add({
            title: 'کالا / خدمات',
            url: 'products',
            icon: 'fa fa-star'
        });

    menuItemsProvider
        .add({
            title: 'اشخاص',
            url: 'people',
            icon: 'fa fa-user'
        });

    menuItemsProvider
        .add({
            title: 'بانک',
            url: 'bank',
            icon: 'fa fa-bank'
        });

    menuItemsProvider
        .add({
            title: 'صندوق',
            url: 'funds',
            icon: 'fa fa-archive'
        });

    menuItemsProvider
        .add({
            title: 'فروش',
            url: '',
            icon: 'fa fa-shopping-cart',
            children: [
                ...overcome
            ]
        });

    menuItemsProvider
        .add({
            title: 'خرید',
            url: '',
            icon: 'fa fa-shopping-basket',
            children: [
                ...cost
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