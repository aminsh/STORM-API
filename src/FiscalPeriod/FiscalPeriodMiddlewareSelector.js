import {inject, injectable} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class FiscalPeriodMiddlewareSelector {

    @inject("DbContext")
    /** @type {DbContext}*/ dbContext = undefined;

    handle(req) {

        const branchId = req.branchId,
            fiscalPeriodId = req.body.fiscalPeriodId || req.query.fiscalPeriodId || req.cookies['current-period'];

        if (!fiscalPeriodId) {
            req.fiscalPeriodId = this._getMaxId(branchId);
            return;
        }

        let fiscalPeriod = this._getById(branchId, fiscalPeriodId);

        if (fiscalPeriod) {
            req.fiscalPeriodId = fiscalPeriod.id;
            return;
        }

        req.fiscalPeriodId = this._getMaxId(branchId);
    }

    _getMaxId(branchId) {

        const knex = this.dbContext.instance;

        let currentDate = Utility.PersianDate.current();
        let result = toResult(knex.select('id').from('fiscalPeriods')
            .where('branchId', branchId)
            .where('isClosed', false)
            .where('minDate', '<=', currentDate)
            .orderBy('minDate', 'desc')
            .first());

        return result ? result.id : null;
    }

    _getById(branchId, id) {
        const knex = this.dbContext.instance;

        return toResult(knex.select('*')
            .from('fiscalPeriods')
            .where('branchId', branchId)
            .where('id', id)
            .first());
    }
}