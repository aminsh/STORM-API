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
            title: 'حسابدار',
            url: '',
            icon: 'fa fa-user',
            children: [
                ...chartOfAccount,
                ...journal,
                ...banking,
                ...reporting
            ]
        });

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


});