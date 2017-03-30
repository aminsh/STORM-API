import accModule from '../acc.module';

accModule.config(menuItemsProvider => {
    "use strict";

    menuItemsProvider
        .add({
            title: 'سرفصل حسابها و سطوح',
            url: '',
            icon: 'fa fa-tasks',
            children: [
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
            ]
        })
        .add({
            title: 'سند حسابداری',
            url: '',
            icon: 'fa fa-book',
            children: [
                {
                    title: 'لیست اسناد حسابداری',
                    url: 'journals',
                    icon: ''
                },
                {
                    title: 'مدیریت اسناد',
                    url: 'journal-management',
                    icon: ''
                },
                {
                    title: 'کپی سند',
                    url: 'journal/copy',
                    icon: 'glyphicon glyphicon-copy'
                },
                {
                    title: 'سند استاندارد',
                    url: 'journal-templates'
                }
            ]
        })
        .add({
            title: 'خزانه داری',
            url: '',
            icon: 'fa fa-money',
            children: [
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
            ]
        })
        .add({
            title: 'گزارشات',
            url: '',
            icon: 'fa fa-pie-chart',
            children: [
                {
                    title: 'مرور حساب',
                    url: 'account-review',
                    icon: ''
                },
                {
                    title: 'گزارشات',
                    url: 'reports',
                    icon: ''
                }
            ]
        });
});