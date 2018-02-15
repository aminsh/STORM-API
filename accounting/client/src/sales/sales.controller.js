import InvoiceListControllerBase from "./invoiceListController";

class SalesController extends InvoiceListControllerBase {

    constructor(translate,
                confirm,
                devConstants,
                logger,
                $timeout,
                $state,
                saleApi,
                navigate,
                $scope,
                reportParameters) {

        super(translate,
            confirm,
            devConstants,
            logger,
            $timeout,
            $state,
            saleApi,
            navigate,
            $scope,
            'sales');

        this.createStateName = 'createSale';
        this.reportParameters = reportParameters;

        this.gridOption.columns.unshift({
            name: 'invoiceStatus',
            title: translate('Fixed ?'),
            type: 'invoiceStatus',
            width: '120px',
            template: `<i ng-if="item.invoiceStatus == 'Fixed'"
                            class="fa fa-lock fa-lg"></i>`,
            css:'text-center',
            header:{
                css: 'text-center'
            }
        });

        this.gridOption.columns.push({
            name: '',
            title: translate('Is paid?'),
            filterable: false,
            sortable: false,
            type: '',
            template: `<i ng-if="item.sumRemainder <= 0"
                            class="fa fa-check fa-lg text-navy"></i>`,
            css:'text-center',
            header:{
                css: 'text-center'
            }
        });

        let editActionCommand = this.gridOption.commands.asEnumerable()
            .single(cmd => cmd.name ==='edit');

        editActionCommand.canShow = current => current.status !== 'fixed';
    }

    edit(current) {
        this.$state.go('editSale', {id: current.id});
    }

    view(current) {
        this.$state.go('viewSale', {id: current.id});
    }

    invoiceTurnover() {
        this.reportParameters.show([{name: "date"},{ name: "number"}])
            .then(params => {
                this.navigate(
                    'report.print',
                    {key: 'sale-invoice-turnover'},
                    params);
            });
    }
}

export default SalesController;