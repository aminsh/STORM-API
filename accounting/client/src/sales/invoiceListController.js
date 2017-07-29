export default class invoiceListController {
    constructor(translate,
                confirm,
                devConstants,
                logger,
                $timeout,
                $state,
                saleApi,
                purchaseApi,
                navigate,
                $scope) {

        this.confirm = confirm;
        this.translate = translate;
        this.navigate = navigate;
        this.$state = $state;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.errors = [];

        let invoiceType = this.invoiceType;

        this.api = invoiceType == 'sales' ? saleApi : purchaseApi;

        let detailAccountTitle = invoiceType == 'sales'
                ? translate('Customer')
                : translate('Vendor'),

            readUrl = invoiceType == 'sales'
                ? devConstants.urls.sales.getAll()
                : devConstants.urls.purchase.getAll()


        this.gridOption = {
            columns: [
                {
                    name: 'date',
                    title: translate('Date'),
                    width: '10%',
                    type: 'date'
                },
                {
                    name: 'number',
                    title: translate('Number'),
                    width: '10%',
                    type: 'number',
                    template: '<a ui-sref="^.view({id: item.id})">{{item.number}}</a>'
                },
                {
                    name: 'detailAccountId',
                    title: detailAccountTitle,
                    width: '15%',
                    type: 'person',
                    template: '<span>{{item.detailAccountDisplay}}</span>'
                },
                {
                    name: 'description',
                    title: translate('Title'),
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
                    action: current => this.print(current)
                }
            ],
            readUrl
        };
    }


    get invoiceType() {
        let regex = /^([^.]*)/;
        let strToMatch = this.$state.current.name;
        return regex.exec(strToMatch)[0];
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

    print(current) {
        let reportParam = {id: current.id};

        this.navigate('report.print', {key: 700}, reportParam);
    }

    edit(current) {
        this.$state.go('^.edit', {id: current.id});
    }

    view(current){
        this.$state.go('^.view', {id: current.id});
    }
}
