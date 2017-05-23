import accModule from '../acc.module';
import Guid from 'guid';
export default class SalesInvoiceController {
    constructor(navigate,
                salesInvoiceApi,
                inventoryApi,
                translate,
                detailAccountApi,
                logger,
                formService,
                $timeout,
                $scope,) {

        this.$scope = $scope;
        this.salesInvoiceApi = salesInvoiceApi;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.navigate = navigate;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.invoice = {
            number: null,
            date: null,
            description: '',
            invoiceLines: []
        };

        detailAccountApi.getAll().then(result => {
                this.detailAccount = result.data
            }
        );

        inventoryApi.getAll().then(result => {
                this.products = result.data
            }
        );
    }

    removeInvoiceLine(item) {
        this.invoice.invoiceLines.asEnumerable().remove(item);
    }

    createInvoiceLine() {
        let $scope = this.$scope;

        let maxRow = this.invoice.invoiceLines.length == 0
                ? 0
                : this.invoice.invoiceLines.asEnumerable().max(line => line.row),
            newInvoice = {
                id: Guid.new(),
                row: ++maxRow,
                itemId: null,
                quantity: 0,
                tax: 0,
                vat: 0,
                discount: 0,
                unitPrice: 0,
                totalPrice: 0,
            };

        this.invoice.invoiceLines.push(newInvoice);
    }

    saveInvoice(form) {
        let logger = this.logger,
            formService = this.formService,
            errors = this.errors,
            invoice = this.invoice
        //isSaving = this.isSaving;

        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        errors.asEnumerable().removeAll();
        //  isSaving = true;

        return this.salesInvoiceApi.create(invoice)
            .then(result => {
                logger.success();
                invoice.id = result.id;
            })
            .catch(err => errors = err)
        // .finally(() => isSaving = false);


    }
}
