class ProductImportFromExcelController {
    constructor($scope,
                $q,
                formService,
                devConstants,
                logger,
                productApi,
                promise) {

        this.$scope = $scope;
        this.logger = logger;
        this.$q = $q;
        this.formService = formService;
        this.productApi = productApi;
        this.promise = promise;

        this.excelList = false;
        this.excelFields = false;
        this.mapper = {code: '', title: '', referenceId:''};
        this.isSaving = false;
        this.hasFirstInput = false;
        this.stockId = false;

        this.urls = {
            getAllStocks: devConstants.urls.stock.getAll()
        };
    }

    run(form) {

        if (form.$invalid) {
            this.formService.setDirty(form);
            this.formService.setDirtySubForm(form);
            return;
        }

        this.isSaving = true;

        let data = this.excelList.asEnumerable()
            .select(item => {
                let product = {
                        code: item[this.mapper.code],
                        referenceId: item[this.mapper.referenceId],
                        title: item[this.mapper.title]
                    },
                    inputData;

                if (this.hasFirstInput)
                    inputData = {
                        quantity: (item[this.mapper.quantity] || '').toNumber(),
                        unitPrice: (item[this.mapper.unitPrice] || '').toNumber()
                    };

                return Object.assign(product, inputData);

            })
            .toArray();

        this.productApi.createBatch({products: data, stockId: this.stockId})
            .then(() => this.$scope.$close());
    }

    afterGetExcelFile(data) {

        let workbook = XLSX.read(data, {type: 'binary'}),
            worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        this.excelList = worksheet;
        this.excelFields = Object.keys(worksheet[0]);
    }

    close() {
        this.$scope.$dismiss();
    }
}

export default ProductImportFromExcelController;