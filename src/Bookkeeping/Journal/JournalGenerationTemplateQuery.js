import toResult from "asyncawait/await";
import { injectable, inject } from "inversify";
import { BaseQuery } from "../../Infrastructure/BaseQuery";

import Sale from '../json/Sale.json';
import Input from '../json/Input.json';
import InputPurchase from '../json/InputPurchase.json';
import Output from '../json/Output.json';
import OutputTransferBetweenStocks from '../json/OutputTransferBetweenStocks';
import InputTransferBetweenStocks from '../json/InputTransferBetweenStocks';
import enums from "../../Constants/enums";

@injectable()
export class JournalGenerationTemplateQuery extends BaseQuery {

    tableName = "journalGenerationTemplates";

    @inject('Enums') enums = undefined;

    templates = {
        Sale, InputPurchase, Input, InputTransferBetweenStocks, OutputTransferBetweenStocks, Output
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
        return this.templates[ model ];
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