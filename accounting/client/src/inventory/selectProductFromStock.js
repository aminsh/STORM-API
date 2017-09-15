export default class SelectProductFromStockController {
    constructor($scope, inventoryApi, data) {

        this.$scope = $scope;

        this.productDisplay = data.productDisplay;

        inventoryApi.getProductInventoryByStock(data.productId)
            .then(result => this.inventories = result);
    }

    selectStock(item) {
        this.$scope.$close({stockId: item.stockId, stockDisplay: item.stockDisplay});
    }

    close() {
        this.$scope.$dismiss();
    }
}