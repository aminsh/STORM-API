import toResult from "asyncawait/await";
import { injectable } from "inversify";
import { BaseQuery } from "../Infrastructure/BaseQuery";

@injectable()
export class InventoryIOTypeQuery extends BaseQuery {

    tableName = "inventoryIOTypes";

    getAll(type, parameters) {
        let branchId = this.branchId,
            tableName = this.tableName,
            knex = this.knex,

            query = this.knex.select().from(function () {
                let q = this.select(
                    `${tableName}.*`,
                    knex.raw('"journalGenerationTemplates".title as journal_generation_template_title'))
                    .from(tableName)
                    .leftJoin('journalGenerationTemplates', `${tableName}.journalGenerationTemplateId`, 'journalGenerationTemplates.id')
                    .where(`${tableName}.branchId`, branchId);

                if(type)
                    q.where('type', type);

                q.as('base');
            });


        return toResult(Utility.kendoQueryResolve(query, parameters, this.view.bind(this)));
    }

    view(entity) {
        return {
            id: entity.id,
            title: entity.title,
            readOnly: !!entity.key,
            key: entity.key,
            journalGenerationTemplateId: entity.journalGenerationTemplateId,
            journalGenerationTemplateTitle: entity[ 'journal_generation_template_title' ]
        }
    }
}