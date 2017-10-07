export default class SelectProductFromStockController {
    constructor($scope, inventoryApi, data) {

        this.$scope = $scope;

        this.productDisplay = data.productDisplay;

        inventoryApi.getProductInventoryByStock(data.productId)
            .then(result => {
                this.inventories = result;

                if (this.inventories.length === 0)
                    return this.$scope.$close();

                let totalInventory = this.inventories.asEnumerable().sum(item => item.sumQuantity);

                if (totalInventory === 0)
                    return this.$scope.$close();

                if (this.inventories.length === 1)
                    this.$scope.$close(this.map(this.inventories[0]));
            });
    }

    map(item) {
        return {
            stockId: item.stockId,
            stockDisplay: item.stockDisplay,
            stockInventory: item.sumQuantity
        }
    }

    selectStock(item) {
        this.$scope.$close(this.map(item));
    }

    close() {
        this.$scope.$dismiss();
    }
}