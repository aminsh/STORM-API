export default class invoiceListControllerBase {

    constructor(translate,
                confirm,
                devConstants,
                logger,
                $timeout,
                $state,
                api,
                navigate,
                $scope,
                invoiceType) {

        this.confirm = confirm;
        this.translate = translate;
        this.navigate = navigate;
        this.$state = $state;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.errors = [];
        this.api = api;

        let urls = {
                sales: devConstants.urls.sales.getAll(),
                purchase: devConstants.urls.purchase.getAll(),
                returnSale: devConstants.urls.returnSale.getAll()
            },

            readUrl = urls[invoiceType];

        this.gridOption = {
            columns: [
                {
                    name: 'date',
                    title: translate('Date'),
                    width: '10%',
                    type: 'date',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'number',
                    title: translate('Number'),
                    width: '10%',
                    type: 'number',
                    template: '<a ui-sref="^.view({id: item.id})">{{item.number}}</a>',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'detailAccountId',
                    title: translate('Customer'),
                    width: '15%',
                    type: 'person',
                    template: '<span>{{item.detailAccountDisplay}}</span>'
                },
                {
                    name: 'title',
                    title: translate('Invoice title'),
                    width: '20%',
                    type: 'string'
                },
                {
                    name: 'sumTotalPrice',
                    title: translate('Amount'),
                    type: 'number',
                    width: '10%',
                    template: '<span>{{item.sumTotalPrice|number}}</span>'
                },
                {
                    name: 'sumRemainder',
                    title: translate('Remainder'),
                    type: 'number',
                    width: '10%',
                    template: '<span>{{item.sumRemainder|number}}</span>'
                },
                {
                    name: 'invoiceStatus',
                    title: translate('Status'),
                    type: 'invoiceStatus',
                    width: '10%',
                    template: '<span>{{item.statusDisplay}}</span>'
                }

            ],
            commands: [
                {
                    title: translate('Remove'),
                    icon: 'fa fa-trash text-danger fa-lg',
                    action: current => this.remove(current),
                    canShow: current => current.status == 'draft'
                },
                {
                    title: translate('Edit'),
                    icon: 'fa fa-edit text-success fa-lg',
                    action: current => this.edit(current),
                    canShow: current => current.status == 'draft'
                },
                {
                    title: translate('Show'),
                    icon: 'fa fa-eye text-success fa-lg',
                    action: current => this.view(current)
                },
                {
                    title: translate('Print'),
                    icon: 'fa fa-print text-success fa-lg',
                    action: current => this.printUnofficialInvoice(current),
                    canShow: current => current.status !== 'draft'
                },
                {
                    title: translate('Print as official invoice'),
                    icon: 'fa fa-print text-success fa-lg',
                    action: current => this.printOfficialInvoice(current),
                    canShow: current => current.status !== 'draft'
                },
                {
                    title: translate('Print preInvoice'),
                    icon: 'fa fa-print text-success fa-lg',
                    action: current => this.printPreInvoice(current),
                    canShow: current => current.status === 'draft'
                },
                {
                    title: translate('Print payment receipt'),
                    icon: 'fa fa-print text-success fa-lg',
                    action: current => this.printPaymentReceipt(current),
                    canShow: current => current.status == 'paid'
                },

                {
                    title: translate('Generate journal'),
                    icon: 'fa fa-share-square-o text-success fa-lg',
                    action: current => {
                        this.generateJournal(current);
                        this.gridOption.refresh();
                    },
                    canShow: current => current.status !== 'draft' && !current.journalId
                }
            ],
            readUrl
        };
    }

    remove(current) {
        let translate = this.translate;

        this.confirm(
            translate('Remove invoice'),
            translate('Are you sure ?')
        ).then(() => {
            this.api.remove(current.id)
                .then(() => {
                    this.gridOption.refresh();
                    this.logger.success();
                });
        })
    }

    printOfficialInvoice(current) {
        let reportParam = {id: current.id};

        this.navigate('report.print', {key: 700}, reportParam);
    }

    printUnofficialInvoice(current) {
        let reportParam = {id: current.id};

        this.navigate('report.print', {key: 703}, reportParam);
    }

    printPreInvoice(current) {
        let reportParam = {id: current.id};

        this.navigate('report.print', {key: 704}, reportParam);
    }

    printPaymentReceipt(current) {
        let reportParam = {id: current.id};

        this.navigate('report.print', {key: 702}, reportParam);
    }

    edit() {
        throw new Error('Not implemented this method');
    }

    view() {
        throw new Error('Not implemented this method');
    }

    generateJournal(current) {
        this.api.generateJournal(current.id)
            .then(() => this.logger.success())
            .catch(errors => this.logger.error(errors.join('<br/>')));
    }
}
