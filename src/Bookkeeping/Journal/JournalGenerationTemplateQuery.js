import toResult from "asyncawait/await";
import {injectable} from "inversify";
import {BaseQuery} from "../../Infrastructure/BaseQuery";

import templateSale from '../json/sale.json';
import templatePurchase from '../json/purchase.json';
import templateReturnSale from '../json/returnSale.json';
import templateInventoryOutputSale from '../json/inventoryOutputSale.json';
import templateInventoryInputReturnSale from '../json/inventoryInputReturnSale.json';
import templateReturnPurchase from '../json/returnPurchase.json';

@injectable()
export class JournalGenerationTemplateQuery extends BaseQuery {

    templates = {
        sale: templateSale,
        purchase: templatePurchase,
        returnSale: templateReturnSale,
        inventoryOutputSale: templateInventoryOutputSale,
        inventoryInputReturnSale: templateInventoryInputReturnSale,
        returnPurchase: templateReturnPurchase
    };

    getAll(parameters) {
        const query = this.knex.select('id', 'title')
            .from(this.tableName)
            .where('branchId', this.branchId);

        return toResult(Utility.kendoQueryResolve(query, parameters, item => ({id: item.id, title: item.title})));
    }

    getBySourceType(sourceType) {
        const template = this.templates[sourceType],
            branchId = this.branchId,

            entity = toResult(this.knex.select('id', 'title', 'sourceType', 'data')
                .from(this.tableName)
                .where('branchId', branchId)
                .where('sourceType', sourceType)
                .first());


        return entity
            ? {
                id: entity.id,
                title: entity.title,
                fields: template.fields,
                data: entity.data
            }
            : template;
    }

}