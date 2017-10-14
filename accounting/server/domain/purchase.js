"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InvoiceRepository = require('../data/repository.invoice'),
    ProductDomain = require('../domain/product'),
    DetailAccountDomain = require('../domain/detailAccount'),
    Guid = instanceOf('utility').Guid,
    PersianDate = instanceOf('utility').PersianDate;

class Purchase {

    constructor(branchId) {
        this.id = '';
        this.number = 0;
        this.date = '';
        this.description = '';
        this.vendor = {};
        this.invoiceType = 'purchase';
        this.invoiceStatus = 'draft';
        this.invoiceLines = [];

        this.repository = new InvoiceRepository(branchId);
        this.detailAccount = new DetailAccountDomain(branchId);
    }


    static create(branchId, cmd) {
        
        let instance = new Purchase(branchId);
        
        

        instance.changeStatus = 'created';

        if (cmd.number)
            instance.number = cmd.number;
        else
            await(instance.setNewNumber());

        instance.date = cmd.date || PersianDate.current();
        instance.description = cmd.description;
        instance.vendor = await(instance.detailAccount.findPersonByIdOrCreate(cmd.vendor));
        instance.invoiceType = 'purchase';
        instance.invoiceStatus = 'draft';
        instance.invoiceLines = cmd.inventoryLines.asEnumerable()
            .select(item => new PurchaseLine(item))
            .toArray();

        instance.branchId = '';

        return instance;
    }
    
    static findById(branchId,id){
        
        const repository  = new InvoiceRepository(branchId),
            detailAccount = new DetailAccountDomain(branchId);
        
        let data = await(repository.findById(id)),
            
            instance = new Purchase(branchId);
        
        instance.number = data.number;
        instance.date= data.date;
        instance.description = data.description;
        instance.invoiceStatus = data.invoiceStatus;
        instance.vendor = await(detailAccount.findPersonByIdOrCreate(data.detailAccountId));
        
        instance.invoiceLines = data.invoiceLines.asEnumerable()
            .select(item => new PurchaseLine(branchId, item))
            .toArray()
        
    }

    changeToConfirmStatus() {
        this.invoiceStatus = 'waitForPayment';
    }

    changedToPaidStatus() {
        this.invoiceStatus = 'paid';
    }

    setNewNumber() {
        this.number = (await(this.repository.purchaseMaxNumber()).max || 0) + 1
    }

    save() {
        let data = this.toData();

        if (this.changeStatus === 'created'){
            await(this.repository.create(data));
            this.id = data.id;
        }

        if (this.changeStatus === 'modified')
            await(this.repository.updateBatch(this.id, data));

        if (this.changeStatus === 'removed')
            await(this.repository.remove(this.id));
    }

    toData() {
        return {
            number: this.number,
            date: this.date,
            detailAccountId: this.vendor.id,
            description: this.description,
            invoiceStatus: this.invoiceStatus,
            invoiceLines: this.invoiceLines.asEnumerable()
                .select(item => item.toData)
                .toArray()
        }
    }

    remove() {
        this.changeStatus = 'removed';
    }

    validate() {
        let errors = [];

        if(!this.vendor)
            errors.push('فروشنده نباید خالی باشد');

        if(this.invoiceLines.length === 0)
            errors.push('ردیف های فاکتور وجود ندارد');

        errors = errors.concat(this.invoiceLines.asEnumerable()
            .selectMany(line => line.validate())
            .toArray());

        return errors;
    }

}

class PurchaseLine {

    constructor(branchId, cmd) {
        this.id = cmd.id;
        this.product = cmd.product;
        this.description = cmd.description;
        this.quantity = cmd.quantity;
        this.unitPrice = cmd.unitPrice;
        this.discount = cmd.discount;
        this.vat = cmd.vat;

        this.productDomain = new ProductDomain(branchId);

        this.product = await(this.productDomain.findByIdOrCreate(cmd.product || cmd.productId));
    }

    validate() {
        let errors = [];

        if (!this.product)
            errors.push('کالا یا شرح کالا نباید خالی باشد');

        if (!(this.quantity && this.quantity !== 0))
            errors.push('مقدار نباید خالی یا صفر باشد');

        if (!(this.unitPrice && this.unitPrice !== 0))
            errors.push('قیمت واحد نباید خالی یا صفر باشد');

        return errors;
    }
    
    toData(){
        return {
            id: this.id,
            productId: this.product.id,
            quantity: this.quantity,
            unitPrice: this.unitPrice,
            discount: this.discount,
            vat: this.vat
        }
    }
}

module.exports = {Purchase};