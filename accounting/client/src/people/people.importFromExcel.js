class PeopleImportFromExcelController {
    constructor($scope,
                $q,
                formService,
                devConstants,
                logger,
                confirm,
                peopleApi,
                promise,
                translate) {

        this.$scope = $scope;
        this.logger = logger;
        this.confirm = confirm;
        this.$q = $q;
        this.formService = formService;
        this.peopleApi = peopleApi;
        this.promise = promise;
        this.translate = translate;

        this.excelList = false;
        this.excelFields = false;
        this.mapper = {
            code: '', title: '', personType: '', nationalCode: ''
            , economicCode: '', postalCode: '', address: '', province: '', city: '', phone: '', mobile: '', email:'', fax:''
        };
        this.isSaving = false;
        this.hasFirstInput = false;
        //this.stockId = false;

        /*        this.urls = {
         getAllStocks: devConstants.urls.stock.getAll()
         };*/
    }

    run(form) {

        if (form.$invalid) {
            this.formService.setDirty(form);
            this.formService.setDirtySubForm(form);
            return;
        }

        let data = this.excelList.asEnumerable()
            .select(item => {
                return {
                    code: item[this.mapper.code],
                    title: item[this.mapper.title],
                    personType: item[this.mapper.personType],
                    nationalCode: item[this.mapper.nationalCode],
                    economicCode: item[this.mapper.economicCode],
                    postalCode: item[this.mapper.postalCode],
                    address: item[this.mapper.address],
                    province: item[this.mapper.province],
                    city: item[this.mapper.city],
                    phone: item[this.mapper.phone],
                    mobile: item[this.mapper.mobile],
                    email: item[this.mapper.email],
                    fax: item[this.mapper.fax]
                };
            })
            .toArray();

        let emptyTitles = data.asEnumerable()
                .where(item => !(item.title && item.title.length >= 3))
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

            errors = [];

        if (emptyTitles.length > 0)
            errors = [this.translate('{0} don`t have title').format(emptyTitles.length)];

        if (duplicatedCodes.length > 0)
            errors.push(this.translate('{0} codes is duplicated').format(duplicatedCodes.join('-')));

        if (errors.length === 0) {
            this.isSaving = true;

            data.forEach(item => item.personType = item.personType && ['real', 'legal'].includes(item.personType) ? item.personType : 'real');

            this.peopleApi.createBatch(data)
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
                        .toArray();

                    correctData.forEach(item => item.personType = item.personType && ['real', 'legal'].includes(item.personType) ? item.personType : 'real');

                    this.peopleApi.createBatch({people: correctData})
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

export default PeopleImportFromExcelController;