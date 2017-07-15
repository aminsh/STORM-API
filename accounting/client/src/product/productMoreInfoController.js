"use strict";

export default class ProductMoreInfoController {
    constructor($scope,
                productApi,
                $stateParams,
                formService,
                devConstants,
                translate) {

        let data = $stateParams;
        this.$scope = $scope;
        this.productApi = productApi;
        this.formService = formService;
        this.translate = translate;
        this.id = data.id;
        this.errors = [];
        this.productTypes = devConstants.enums.ProductType().data;
        this.product = [];
        if (this.id)
            productApi.getById(data.id)
                .then(result => {
                    this.product = result;
                    // this.lbl = ["January", "February", "March", "April", "May", "June", "July"];
                    // console.log(this.lbl);
                    // this.data = [65, 59, 80, 81, 56, 55, 40];
                    // this.options = {
                    //     responsive: true,
                    //     legend: {display: true},
                    //     maintainAspectRatio: false,
                    // };
                });

        productApi.summary(data.id).then(result => {
            console.log(result);
            let items = result.asEnumerable();

            let colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

            this.series = [translate('Sum Of Sale Amount'), translate('Count Of Sale Quantity')];

            this.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];

            this.options = {
                responsive: true,
                legend: {display: true},
                maintainAspectRatio: false,
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            display: true,
                            position: 'right'
                        }
                    ]
                }
            };

            this.labels = items.select(item => item.monthDisplay).toArray();

            this.labelForDisplay = colors.asEnumerable()
                .take(this.labels.length)
                .select(c => ({color: c, label: this.labels[colors.indexOf(c)]}))
                .toArray();

            this.data = [items.select(item => parseInt(item.sumPrice)).toArray(), items.select(item => parseInt(item.sumQuantity)).toArray()];


        });
    }

    close() {
        this.$scope.$dismiss();
    }
}