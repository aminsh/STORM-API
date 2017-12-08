class SalesAggregationController {

    /**
     * @param {ReportApi} reportApi
     */
    constructor(devConstants, translate, $scope, reportParameters, $timeout, reportApi, exportToExcel) {

        this.$scope = $scope;
        this.reportParameters = reportParameters;
        this.devConstants = devConstants;
        this.reportApi = reportApi;
        this.exportToExcel = exportToExcel;

        $scope.$emit('close-sidebar');

        this.seasons = devConstants.enums.getSeason().data;
        this.months = devConstants.enums.getMonth().data;
        this.detailAccountStatuses = devConstants.enums.getNationalCodeIncluded().data;
        this.vatStatuses = devConstants.enums.getVatIncluded().data;

        this.gridOptions = {
            name: 'seasonal',
            columns: [
                {
                    name: 'rowNumber',
                    title: translate('Row'),
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'date',
                    title: translate('Date'),
                    type: 'date',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'productTitle',
                    title: translate('Product title'),
                    template: '<span title="{{item.productTitle}}">{{item.productTitle}}</span>',
                    type: 'string',
                    css: 'text-center giveMeEllipsis',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'iranCode',
                    title: translate('IranCode'),
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'price',
                    title: translate('Price'),
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'discount',
                    title: translate('Discount'),
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'returnPrice',
                    title: translate('Return price'),
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'tax',
                    title: translate('Tax'),
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
                    type: 'number',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'postalCode',
                    title: translate('Postal code'),
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'phone',
                    title: translate('Phone'),
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'address',
                    title: translate('Address'),
                    type: 'string',
                    template: '<span title="{{item.address}}">{{item.address}}</span>',
                    css: 'text-center giveMeEllipsis',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'personName',
                    title: translate('Person name'),
                    type: 'string',
                    template: '<span title="{{item.personName}}">{{item.personName}}</span>',
                    css: 'text-center giveMeEllipsis',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'economicCode',
                    title: translate('Economic code'),
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'nationalCode',
                    title: translate('National code'),
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'province',
                    title: translate('Province'),
                    type: 'string',
                    template: '<span title="{{item.province}}">{{item.province}}</span>',
                    css: 'text-center giveMeEllipsis',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'city',
                    title: translate('City'),
                    type: 'string',
                    template: '<span title="{{item.city}}">{{item.city}}</span>',
                    css: 'text-center giveMeEllipsis',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'totalPrices',
                    title: translate('Total price'),
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
            col.style = {
                fontSize: '11px'
            };
            //col.css = 'text-center giveMeEllipsis';
            col.header = {css: 'text-center noWarp'};
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

        $timeout(() => {
            this.onChangedFilter();
            this.gridOptions.readUrl = devConstants.urls.report.seasonal();
        });
    }

    onLoadData(data) {
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
        this.currentFilter = filter;
    }

    runExportToExcel() {
        let columns = this.gridOptions.columns,
            exportedData = [];

        this.reportApi.getSeasonal(this.currentFilter)
            .then(result => {

                let data = result.data;

                data.forEach((item, i) => {

                    let result = {};

                    columns.forEach(col => {
                        if (col.name === 'row')
                            result[col.title] = i + 1;
                        else if (col.name === 'totalPrices')
                            result[col.title] = item.totalPrice - item.totalReturnPrice;
                        else
                            result[col.title] = item[col.name];
                    });

                    exportedData.push(result);
                });

                this.exportToExcel(exportedData, "seasonal");
            });
    }
}

export default SalesAggregationController;
