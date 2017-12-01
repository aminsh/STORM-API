class SalesAggregationController {

    /**
     * @param {ReportApi} reportApi
     */
    constructor(devConstants, translate, $scope, reportParameters, $timeout, reportApi) {

        this.$scope = $scope;
        this.reportParameters = reportParameters;
        this.devConstants = devConstants;
        this.reportApi = reportApi;

        $scope.$emit('close-sidebar');

        this.seasons = devConstants.enums.getSeason().data;
        this.months = devConstants.enums.getMonth().data;
        this.detailAccountStatuses = devConstants.enums.getNationalCodeIncluded().data;
        this.vatStatuses = devConstants.enums.getVatIncluded().data;

        this.gridOptions = {
            name: 'seasonal',
            columns: [
                {
                    name: 'row',
                    title: translate('Row'),
                    width: '2%',
                    fontSize: '11px',
                    type: 'number',
                    template: '<span>{{$parent.$index+1}}</span>',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'date',
                    title: translate('Date'),
                    width: '5%',
                    type: 'date',
                    fontSize: '11px',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'productTitle',
                    title: translate('Product title'),
                    width: '5%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'iranCode',
                    title: translate('IranCode'),
                    width: '5%',
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'price',
                    title: translate('Price'),
                    width: '5%',
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'discount',
                    title: translate('Discount'),
                    width: '5%',
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'returnPrice',
                    title: translate('Return price'),
                    width: '5%',
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'tax',
                    title: translate('Tax'),
                    width: '5%',
                    type: 'number',
                    template: '<span>{{item.tax|number:1}}</span>',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'vat',
                    title: translate('Vat'),
                    width: '5%',
                    type: 'number',
                    template: '<span>{{item.vat|number:1}}</span>',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'personTypeText',
                    title: translate('Person type text'),
                    width: '5%',
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'postalCode',
                    title: translate('Postal code'),
                    //width: '10%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'phone',
                    title: translate('Phone'),
                    //width: '10%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'address',
                    title: translate('Address'),
                    //width: '10%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'personName',
                    title: translate('Person name'),
                    //width: '10%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'economicCode',
                    title: translate('Economic code'),
                    //width: '10%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'nationalCode',
                    title: translate('National code'),
                    //width: '10%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'province',
                    title: translate('Province'),
                    //width: '10%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'city',
                    title: translate('City'),
                    //width: '10%',
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'totalPrices',
                    title: translate('Total price'),
                    //width: '10%',
                    template: '<span>{{item.totalPrice-item.totalReturnPrice|number}}</span>',
                    sortable: false,
                    filterable: false,
                    fontSize: '11px',
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                }
            ],
            commands: [],
            sort: [
                {dir: 'desc', field: 'date'}
            ],
            readUrl: ''
        };

        this.gridOptions.columns.forEach(col => {
            //delete col.width;
            col.width = '5%';
            col.fontSize = '11px';
            col.filterable = false;
            col.sortable = false;
        });

        this.invoiceTypes = [
            {key: 'sale', display: 'فروش و برگشت از فروش'},
            {key: 'purchase', display: 'خرید و برگشت از خرید'}
        ];

        this.filterType = [
            {key: 'month', display: 'ماه'},
            {key: 'season', display: 'فصل'},
            {key: 'date', display: 'تاریخ'}
        ];

        this.selectedFilterType = 'season';

        const currentMonth = parseInt(localStorage.today.substring(5, 7));

        this.filter = {
            haveVat: 1,
            haveNationalCode: 1,
            minDate: '',
            maxDate: '',
            season: this.getSeasonByMonth(currentMonth),
            month: currentMonth,
            invoiceType: 'sale'
        };

        /*this.total = {
            sale:{
                sumPrice: 0,
                sumDiscount: 0,
                sumVat: 0,
                totalPrice: 0
            },
            purchase: {
                sumPrice: 0,
                sumDiscount: 0,
                sumVat: 0,
                totalPrice: 0
            },
            returnSale:{
                sumPrice: 0,
                sumDiscount: 0,
                sumVat: 0,
                totalPrice: 0
            },
            returnPurchase:{
                sumPrice: 0,
                sumDiscount: 0,
                sumVat: 0,
                totalPrice: 0
            },
        };*/

        $timeout(() => {
            this.onChangedFilter();
            this.gridOptions.readUrl = devConstants.urls.report.seasonal();
        });
    }

    onLoadData(data){
        console.log(data);
        this.total = data.resultTotal;
    }

    getSeasonByMonth(month) {
        if (month <= 3)
            return 1;
        else if (month <= 6)
            return 2;
        else if (month <= 9)
            return 3;
        else
            return 4;
    }

    selectInvoiceType(item) {
        this.filter.invoiceType = item.key;
        this.onChangedFilter();
    }

    /*getTotal(filter) {
        this.reportApi.getTotalSeasonal(filter)
            .then(resultTotal => this.total = resultTotal);
    }*/

    onChangedFilter() {

        let filter = {
            haveVat: this.filter.haveVat,
            haveNationalCode: this.filter.haveNationalCode,
            invoiceType: this.filter.invoiceType
        };

        if (this.selectedFilterType === 'month')
            filter.month = this.filter.month;


        if (this.selectedFilterType === 'season')
            filter.season = this.filter.season;


        if (this.selectedFilterType === 'date') {
            filter.minDate = this.filter.minDate;
            filter.maxDate = this.filter.maxDate;
        }

        this.$scope.$broadcast(`${this.gridOptions.name}/execute-advanced-search`, {filter});
    }
}

export default SalesAggregationController;
