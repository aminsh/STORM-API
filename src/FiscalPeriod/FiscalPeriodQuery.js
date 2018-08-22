import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";

export class FiscalPeriodQuery extends BaseQuery {

    getById(id) {
        let fiscalPeriod = toResult(this.knex.select('*')
            .from('fiscalPeriods')
            .where('branchId', this.branchId)
            .where('id', id)
            .first());

        return this._view(fiscalPeriod);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw('*,\'{0} \' || "minDate" || \' {1} \' || "maxDate" as "display"'
                .format('از', 'تا')))
                .from('fiscalPeriods')
                .where('branchId', branchId)
                .as('baseFiscalPeriod');
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    getMaxId() {

        let currentDate = Utility.PersianDate.current();
        let result = toResult(this.knex.select('id').from('fiscalPeriods')
            .where('branchId', this.branchId)
            .where('isClosed', false)
            .where('minDate', '<=', currentDate)
            .orderBy('minDate', 'desc')
            .first());

        return result ? result.id : null;
    }

    _view(entity) {
        if (!entity)
            return null;

        return {
            title: entity.title,
            minDate: entity.minDate,
            maxDate: entity.maxDate,
            id: entity.id,
            display: entity.display
        };
    }
}
