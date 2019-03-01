import toResult from "asyncawait/await";
import { injectable } from "inversify";
import { BaseQuery } from "../Infrastructure/BaseQuery";

@injectable()
export class InvoiceTypeQuery extends BaseQuery {

    tableName = "invoice_types";

    getAll(invoiceType, parameters) {
        let branchId = this.branchId,
            tableName = this.tableName,
            knex = this.knex,

            query = this.knex.select().from(function () {
                this.select(`${tableName}.*`,
                    knex.raw('"journalGenerationTemplates".title as journal_generation_template_title')
                )
                    .from(tableName)
                    .leftJoin('journalGenerationTemplates', `${tableName}.journalGenerationTemplateId`, 'journalGenerationTemplates.id')
                    .where(`${tableName}.branchId`, branchId)
                    .where('invoiceType', invoiceType)
                    .as('base');
            });


        return toResult(Utility.kendoQueryResolve(query, parameters, this.view.bind(this)));
    }

    getById(id) {
        const entity = toResult(this.knex.select('*')
            .from(this.tableName)
            .where({ branchId: this.branchId, id })
            .first());

        return this.view(entity);
    }

    view(entity) {
        return {
            id: entity.id,
            title: entity.title,
            referenceId: entity.referenceId,
            journalGenerationTemplateId: entity.journalGenerationTemplateId,
            journalGenerationTemplateTitle: entity[ 'journal_generation_template_title' ],
            isDefault: entity.isDefault
        }
    }
}