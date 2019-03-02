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
                    knex.raw('template.title as journal_generation_template_title'),
                    knex.raw('return_template.title as return_journal_generation_template_title')
                )
                    .from(tableName)
                    .leftJoin('journalGenerationTemplates as template', `${tableName}.journalGenerationTemplateId`, 'template.id')
                    .leftJoin('journalGenerationTemplates as return_template', `${tableName}.returnJournalGenerationTemplateId`, 'return_template.id')
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
            returnJournalGenerationTemplateId: entity.returnJournalGenerationTemplateId,
            returnJournalGenerationTemplateTitle: entity[ 'return_journal_generation_template_title' ],
            isDefault: entity.isDefault
        }
    }
}