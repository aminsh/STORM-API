class SaleController {
    constructor(translate){
        this.tabs = [
            {
                heading: `<i>${translate('Sale invoice List')}</i>`,
                route: 'sale.sales'
            },
            {
                heading: `<i>${translate('Return sale')}</i>`,
                route: 'sale.returnSales'
            }
        ];
    }
}

export default SaleController;