"use strict";

class InventoryDetailController {
    constructor($scope, devConstants, inventoryApi, data, translate, formService, logger) {

        this.$scope = $scope;
        this.formService = formService;
        this.inventoryApi = inventoryApi;
        this.logger = logger;
        this.translate = translate;

        this.id = data.id;
        this.errors = [];
        this.isSaving = false;
        this.isPriceEntry = data.isPriceEntry;

        inventoryApi.getById(data.id)
            .then(result => this.inventory = result);

        this.gridOption = {
            columns: [
                {
                    name: 'productId',
                    title: translate('Good'),
                    template: '{{item.productDisplay}}',
                    type: 'string'
                },
                {
                    name: 'quantity',
                    title: translate('Quantity'),
                    template: '<span>{{item.quantity|number}}</span>',
                    type: 'number'
                },
                {
                    name: 'unitPrice',
                    title: translate('Unit price'),
                    width: '15%',
                    template: `<span ng-if="!item.isPriceEntry">{{item.unitPrice|number}}</span>
                               <div ng-if="item.isPriceEntry">
                                    <dev-tag-text-box name="unitPrice" ng-model="item.unitPrice" required not-should-be-zero="item.unitPrice"></dev-tag-text-box>
                                    <div ng-messages="form['form-'+ $index].unitPrice.$error" ng-if="form['form-'+ $index].unitPrice.$dirty">
                                        <label ng-message="required" class="error">{{'This field is required'|translate}}</label>
                                        <label ng-message="notShouldBeZero" class="error">{{'UntiPrice is not allowed to be zero'|translate}}</label>
                                    </div>
                               </div>`,
                    type: 'number'
                },
                {
                    name: 'totalPrice',
                    title: translate('Total price'),
                    template: '<span>{{(item.quantity * item.unitPrice)|number}}</span>',
                    type: 'number',
                    aggregates: ['sum'],
                    footerTemplate: '{{aggregates.sumTotalPrice | number}}'
                }

            ],
            commands: [],
            gridSize: '300px',
            readUrl: devConstants.urls.inventory.getLinesById(data.id),
            mapper: item => item.isPriceEntry = data.isPriceEntry
        };
    }

    close() {
        this.$scope.$dismiss();
    }

    save(form) {

        let lines = (this.gridOption.getData() || []).asEnumerable()
            .select(line => ({
                id: line.id,
                unitPrice: line.unitPrice
            }))
            .toArray();

        if (form.$invalid) {
            this.formService.setDirty(form);
            this.formService.setDirtySubForm(form);

            if (lines.asEnumerable().any(line => !(line.unitPrice && line.unitPrice > 0))){
                this.errors = [this.translate('Unit price should not be empty or zero')];
            }
            return;
        }

        this.errors = [];
        this.isSaving = true;

        this.inventoryApi.inputSetPrice(this.id, lines)
            .then(() => {
                this.logger.success();
                this.close();
            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }


}

export default InventoryDetailController;