"use strict";

export default class ProductMoreInfoController {
    constructor($scope,
                productApi,
                data,
                formService,
                devConstants,
                translate) {

        this.$scope = $scope;
        this.productApi = productApi;
        this.formService = formService;
        this.translate = translate;
        this.id = data.id;
        this.errors = [];
        this.productTypes = devConstants.enums.ProductType().data;


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
    }

    close() {
        this.$scope.$dismiss();
    }
}