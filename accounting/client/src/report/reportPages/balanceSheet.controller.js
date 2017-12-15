class BalanceSheetController {

    /**
     * @param {ReportApi} reportApi
     */
    constructor(devConstants, translate, $scope, reportParameters, reportApi, exportToExcel) {

        this.$scope = $scope;
        this.reportParameters = reportParameters;
        this.devConstants = devConstants;
        this.reportApi = reportApi;
        this.exportToExcel = exportToExcel;

        $scope.$emit('close-sidebar');

        this.fetch();
        this.balanceSheetExportExcel = [
            {
                name: "accountCategoriesKey",
                title: "کد گروه حساب"
            },
            {
                name: "accountCategoriesDisplay",
                title: "گروه حساب"
            },
            {
                name: "generalLedgerAccountsCode",
                title: "کد حساب کل"
            },
            {
                name: "generalLedgerAccountsTitle",
                title: "حساب کل"
            },
            {
                name: "debtor",
                title: "بدهکار"
            },
            {
                name: "creditor",
                title: "بستانکار"
            },
        ]


    }

    fetch() {
        this.reportApi.getBalanceSheet()
            .then(result => {
                this.right = result.asEnumerable()
                    .where(item => ['10', '20','11','12'].includes(item.accountCategoriesKey.toString()))
                    .groupBy(
                        item => item.accountCategoriesKey,
                        item => item,
                        (key, items) => ({
                            key,
                            display: items.first().accountCategoriesDisplay,
                            items: items.toArray()
                        }))
                    .toArray();

                this.left = result.asEnumerable()
                    .where(item => ['30', '40', '50','21','22','31'].includes(item.accountCategoriesKey.toString()))
                    .groupBy(
                        item => item.accountCategoriesKey,
                        item => item,
                        (key, items) => ({
                            key,
                            display: items.first().accountCategoriesDisplay,
                            items: items.toArray()
                        }))
                    .toArray();
            });
    }

    runExportToExcel() {
        let columns = this.balanceSheetExportExcel,
            exportedData = [];

        this.reportApi.getBalanceSheet()
            .then(result => {
                let data = result;
                data.forEach((item) => {
                    let result = {};
                    columns.forEach(col => {
                        result[col.title] = item[col.name];
                    });
                    exportedData.push(result);
                });

                this.exportToExcel(exportedData, "balanceSheet");
            });
    }

    get totalRight(){
        if(!this.right)
            return 0;

        return this.right.asEnumerable()
            .selectMany(item => item.items)
            .sum(item => item.remainder);
    }

    get totalLeft(){
        if(!this.left)
            return 0;

        return this.left.asEnumerable()
            .selectMany(item => item.items)
            .sum(item => item.remainder);
    }
}

export default BalanceSheetController;
