import toResult from "asyncawait/await";
import { injectable, inject } from "inversify";
import { BaseQuery } from "../../Infrastructure/BaseQuery";

import templateSale from '../json/Sale.json';
import templatePurchase from '../json/purchase.json';
import templateReturnSale from '../json/returnSale.json';
import templateInventoryOutputSale from '../json/inventoryOutputSale.json';
import templateInventoryInputReturnSale from '../json/inventoryInputReturnSale.json';
import templateReturnPurchase from '../json/returnPurchase.json';
import enums from "../../Constants/enums";

@injectable()
export class JournalGenerationTemplateQuery extends BaseQuery {

    tableName = "journalGenerationTemplates";

    @inject('Enums') enums = undefined;

    templates = {
        Sale: templateSale,
        purchase: templatePurchase,
        returnSale: templateReturnSale,
        inventoryOutputSale: templateInventoryOutputSale,
        inventoryInputReturnSale: templateInventoryInputReturnSale,
        returnPurchase: templateReturnPurchase
    };

    getAll(parameters) {
        const self = this,
            query = this.knex
                .from(function () {
                    this.select('*')
                        .from(self.tableName)
                        .where('branchId', self.branchId)
                        .as('base');
                }),
            JournalGenerationTemplateModel = enums.JournalGenerationTemplateModel();

        return toResult(Utility.kendoQueryResolve(query, parameters,
            item => ( {
                id: item.id,
                title: item.title,
                model: item.model,
                modelDisplay: item.model
                    ? JournalGenerationTemplateModel.getDisplay(item.model)
                    : null
            } )));
    }

    getByModel(model) {
        const template = this.templates[ model ];
        return template;
    }

    getById(id) {
        const branchId = this.branchId,

            entity = toResult(this.knex.select('id', 'title', 'data', 'fields', 'model')
                .from(this.tableName)
                .where('branchId', branchId)
                .where('id', id)
                .first());

        const template = this.templates[ entity.model ];

        return {
            id: entity.id,
            title: entity.title,
            fields: template.fields,
            data: entity.data,
            model: entity.model
        };
    }

}