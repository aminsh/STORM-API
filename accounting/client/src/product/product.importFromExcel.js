class ProductImportFromExcelController {
    constructor($scope,
                $q,
                formService,
                devConstants,
                logger,
                confirm,
                productApi,
                promise,
                translate) {

        this.$scope = $scope;
        this.logger = logger;
        this.confirm = confirm;
        this.$q = $q;
        this.formService = formService;
        this.productApi = productApi;
        this.promise = promise;
        this.translate = translate;

        this.excelList = false;
        this.excelFields = false;
        this.mapper = {code: '', title: '', referenceId: '', salePrice: ''};
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

        let data = this.excelList.asEnumerable()
            .select(item => {
                let product = {
                        code: item[this.mapper.code],
                        referenceId: item[this.mapper.referenceId],
                        title: item[this.mapper.title],
                        salePrice: item[this.mapper.salePrice]
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

        let emptyTitles = data.asEnumerable()
                .where(item => !(item.title && item.title.length > 3))
                .toArray(),

            duplicatedCodes = data.asEnumerable()
                .where(item => item.code)
                .groupBy(
                    item => item.code,
                    item => item.code,
                    (key, items) => ({key, count: items.count()})
                )
                .where(item => item.count > 1)
                .select(item => item.key)
                .toArray(),

            duplicatedReferenceIds = data.asEnumerable()
                .where(item => item.referenceId)
                .groupBy(
                    item => item.referenceId,
                    item => item,
                    (key, items) => ({key, count: items.count()})
                )
                .where(item => item.count > 1)
                .select(item => item.key)
                .toArray(),
            errors = [];

        if (emptyTitles.length > 0)
            errors = [this.translate('{0} don`t have title').format(emptyTitles.length)];

        if (duplicatedCodes.length > 0)
            errors.push(this.translate('{0} codes is duplicated').format(duplicatedCodes.join('-')));

        if (duplicatedReferenceIds.length > 0)
            errors.push(this.translate('{0} referenceId is duplicated').format(duplicatedReferenceIds.join('-')));

        if (errors.length === 0){
            this.isSaving = true;

            this.productApi.createBatch({products: data, stockId: this.stockId})
                .then(() => this.$scope.$close());
        }

        else {
            this.confirm(
                `<ul>${errors.map(item => `<li>${item}</li>`).join(' ')}</ul>
                <br/> ${this.translate('Do you want to save rest of data ?')}`,
                this.translate('It`s not possible the rows that have these errors'),
                'error'
            )
                .then(() => {
                    this.isSaving = true;

                    let correctData = data.asEnumerable()
                        .where(item => !emptyTitles.includes(item))
                        .where(item => !duplicatedCodes.asEnumerable().any(e => e !== item.code))
                        .where(item => !duplicatedReferenceIds.asEnumerable().any(e => e !== item.referenceId))
                        .toArray();

                    this.productApi.createBatch({products: correctData, stockId: this.stockId})
                        .then(() => this.$scope.$close());
                })
        }
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