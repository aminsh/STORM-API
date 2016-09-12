import accModule from '../acc.module';

accModule.config(menuItemsProvider => {
    "use strict";

    menuItemsProvider
        .add({
            title: 'سرفصل حسابها و سطوح',
            url: '',
            icon: '',
            children: [
                {
                    title: 'حسابهای کل و معین',
                    url: '#/general-ledger-accounts'
                },
                {
                    title: 'حساب تفصیل',
                    url: '#/detail-accounts'
                },
                {
                    title: 'سطوح',
                    url: '#/dimensions'
                }
            ]
        })
        .add({
            title: 'سند حسابداری',
            url: '',
            icon: '',
            children: [
                {
                    title: 'لیست اسناد حسابداری',
                    url: '#/journals',
                    icon: ''
                },
                {
                    title: 'سند حسابداری جدید',
                    url: '#/journal-new',
                    icon: ''
                }
            ]
        })
        .add({
            title: 'خزانه داری',
            url: '',
            icon: '',
            children: [
                {
                    title: 'دسته چک ها',
                    url: '#/cheque-categories',
                    icon: ''
                }
            ]
        });
});