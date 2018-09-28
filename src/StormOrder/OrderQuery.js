import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class OrderQuery {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    @inject("PersistedConfigService")
    /**@type{PersistedConfigService}*/persistedConfigService = undefined;

    tableName = "storm_orders";

    find(id) {

        const knex = this.dbContext.instance;

        let stormBranchId = this.persistedConfigService.get('STORM_BRANCH_ID').value,
            order = toResult(
                knex.select(
                    'storm_orders.*',
                    knex.raw('branches.name as "branchName"'),
                    knex.raw('storm_plans.title as "planDisplay"'))
                    .from('storm_orders')
                    .leftJoin('branches', 'branches.id', 'storm_orders.branchId')
                    .leftJoin('storm_plans', 'storm_orders.planId', 'storm_plans.id')
                    .where('storm_orders.id', id).first()
            );

        order.issuedDate = Utility.PersianDate.getDate(order.issuedDate);

        if (order.invoiceId)
            order.invoiceUrl = `${process.env.DASHBOARD_URL}/invoice/${order.invoiceId}?branchId=${stormBranchId}`;

        return order;
    }

}