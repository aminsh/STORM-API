import {inject, injectable} from "inversify";

@injectable()
export class FiscalPeriodMiddlewareSelector {

    @inject("FiscalPeriodQuery")
    /**@type {FiscalPeriodQuery}*/ fiscalPeriodQuery = undefined;

    handle(req){

        const fiscalPeriodId = req.body.fiscalPeriodId || req.query.fiscalPeriodId || req.cookies['current-period'];

       if(!fiscalPeriodId) {
           req.fiscalPeriodId = this.fiscalPeriodQuery.getMaxId();
           return;
       }

       let fiscalPeriod = this.fiscalPeriodQuery.getById(fiscalPeriodId);

       if(fiscalPeriod) {
           req.fiscalPeriodId = fiscalPeriod.id;
           return;
       }

       req.fiscalPeriodId = this.fiscalPeriodQuery.getMaxId();
    }
}