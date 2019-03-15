import toResult from "asyncawait/await";
import { inject, injectable, postConstruct } from "inversify";

@injectable()
export class CurrencyQuery  {

    tableName = "currency";

    @inject("DbContext")
    /** @type {DbContext}*/ dbContext = undefined;

    @postConstruct()
    init() {
        this.knex = this.dbContext.instance;
    }

    getAll(parameters) {
        const self = this;

        let query = this.knex.from(function () {
            this.select('*')
                .from(self.tableName)
                .as('base');
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, this.view.bind(this)));
    }

    getById(id) {
        const entity = toResult(this.knex.select('*')
            .from(this.tableName)
            .where({ id })
            .first());

        return this.view(entity);
    }

    view(entity) {
        return {
            id: entity.id,
            title: entity.title
        }
    }
}