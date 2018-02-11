import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class InvoiceRepository extends BaseRepository {

    findById(id) {

        let knex = this.knex,

            data = toResult(this.knex.select(
                'invoices.*', 'invoiceLines.*',
                knex.raw('"invoices"."description" as "invoiceDescription"'),
                knex.raw('"invoiceLines"."description" as "invoiceLineDescription"'),
                knex.raw('"invoices"."discount" as "invoiceDiscount"'),
                knex.raw('"invoiceLines"."discount" as "invoiceLineDiscount"'),
                knex.raw('"invoiceLines"."id" as "invoiceLineId"'),
                knex.raw('"detailAccounts"."title" as "detailAccountTitle"'),
                knex.raw('"detailAccounts"."code" as "detailAccountCode"')
            ).from('invoices')
                .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                .leftJoin('detailAccounts','detailAccounts.id','invoices.detailAccountId')
                .modify(this.modify, this.branchId, 'invoices.branchId')
                .andWhere('invoices.id', id));

        let first = data[0];

        if (!first) return null;

        let invoice = {
            id: first.invoiceId,
            number: first.number,
            date: first.date,
            detailAccountId: first.detailAccountId,
            detailAccount: {
                title: first.detailAccountTitle,
                code: first.detailAccountCode
            },
            description: first.invoiceDescription,
            referenceId: first.referenceId,
            journalId: first.journalId,
            invoiceStatus: first.invoiceStatus,
            orderId: first.orderId,
            invoiceType: first.invoiceType,
            ofInvoiceId: first.ofInvoiceId,
            costs: first.costs,
            charges: first.charges,
            bankReceiptNumber: (first.custom || {}).bankReceiptNumber,
            discount: first.invoiceDiscount
        };

        invoice.invoiceLines = data.asEnumerable().select(line => ({
            id: line.invoiceLineId,
            invoiceId: line.invoiceId,
            productId: line.productId,
            description: line.invoiceLineDescription,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
            discount: line.invoiceLineDiscount,
            stockId: line.stockId,
            vat: line.vat
        }))
            .toArray();

        return invoice;
    }

    findByNumber(number, type, notEqualId) {
        let query = this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', type)
            .where('number', number);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return toResult(query.first());
    }

    findInvoiceLinesByInvoiceId(id) {
        return toResult(this.knex.table('invoiceLines')
            .modify(this.modify, this.branchId)
            .where('invoiceId', id));
    }

    maxNumber(invoiceType) {
        const result = toResult(this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', invoiceType)
            .max('number')
            .first());

        return result && result.max ? result.max || 0 : 0;
    }

    isNumberDuplicated(number, invoiceType, notEqualId){
        let query = this.knex.select('id')
            .from('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', invoiceType)
            .where('number', number);

        if(notEqualId)
            query.where('id', '!=', notEqualId);

        return toResult(query.first());
    }

    create(entity) {

        const trx = this.transaction;

        let lines = entity.invoiceLines;

        delete  entity.invoiceLines;

        toResult(this.createInvoice(entity, trx));

        toResult(this.createInvoiceLines(lines, entity.id, trx));

        entity.invoiceLines = lines;

        return entity;
    }

    update(id, entity) {
        toResult(this.knex('invoices')
            .transacting(this.transaction)
            .where('id', id).update(entity));
    }

    updateBatch(id, entity) {
        this.entity = entity;

        let trx = this.transaction;

        let lines = this.entity.invoiceLines;

        delete  entity.invoiceLines;

        toResult(this.updateInvoice(id, entity, trx));

        toResult(this.updateInvoiceLines(id, lines, trx));

        entity.invoiceLines = lines;
    }

    remove(id) {
        return toResult(this.knex('invoices')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }

    createInvoice(entity, trx) {
        super.create(entity);

        toResult(this.knex('invoices')
            .transacting(trx)
            .insert(entity));

        return entity;
    }

    updateInvoice(id, entity, trx) {

        toResult(this.knex('invoices')
            .transacting(trx)
            .where('id', id)
            .update(entity));

        return entity;
    }

    createInvoiceLines(lines, id, trx) {
        lines.forEach(line => {
            super.create(line);
            line.invoiceId = id;
        });

        toResult(this.knex('invoiceLines')
            .transacting(trx)
            .insert(lines));
    }

    updateInvoiceLines(id, lines, trx) {
        let persistedLines = toResult(this.knex.table('invoiceLines').where('invoiceId', id)),

            shouldDeletedLines = persistedLines.asEnumerable()
                .where(e => !lines.asEnumerable().any(p => p.id == e.id))
                .toArray(),
            shouldAddedLines = lines.asEnumerable()
                .where(e => !persistedLines.asEnumerable().any(p => p.id == e.id))
                .toArray(),
            shouldUpdatedLines = lines.asEnumerable()
                .where(e => persistedLines.asEnumerable().any(p => p.id == e.id))
                .toArray();

        if (shouldAddedLines.asEnumerable().any()) {
            shouldAddedLines.forEach(line => {
                super.create(line);
                line.invoiceId = id;
            });

            toResult(this.knex('invoiceLines')
                .transacting(trx)
                .insert(shouldAddedLines));
        }

        if (shouldDeletedLines.asEnumerable().any())
            shouldDeletedLines.forEach(e => toResult(this.knex('invoiceLines')
                .transacting(trx).where('id', e.id).del()));

        if (shouldUpdatedLines.asEnumerable().any())
            shouldUpdatedLines.forEach(e => toResult(this.knex('invoiceLines')
                .transacting(trx).where('id', e.id).update(e)));
    }

    isExistsProduct(productId) {
        return toResult(this.knex('id')
            .from('invoiceLines')
            .modify(this.modify, this.branchId)
            .where('productId', productId)
            .first());
    }

    isExistsCustomer(customerId) {
        return toResult(this.knex('id')
            .from('invoices')
            .modify(this.modify, this.branchId)
            .where('detailAccountId', customerId)
            .first());
    }

    isExitsJournal(journalId) {
        return toResult(this.knex('id')
            .from('invoices')
            .modify(this.modify, this.branchId)
            .where('journalId', journalId)
            .first());
    }

    isExitsStock(stockId) {
        return toResult(this.knex.select('id')
            .from('invoiceLines')
            .modify(this.modify, this.branchId)
            .where('stockId', stockId)
            .first());
    }
}
