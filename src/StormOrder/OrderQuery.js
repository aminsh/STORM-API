import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class OrderQuery {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    @inject("PersistedConfigService")
    /**@type{PersistedConfigService}*/persistedConfigService = undefined;

    @inject("HttpRequest")
    /** @type {HttpRequest} */ httpRequest = undefined;

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

    getInvoiceByOrder(id) {

        const knex = this.dbContext.instance,
            order = toResult(knex.select('invoiceId').from('storm_orders').where({id}).first());

        if (!order)
            throw new NotFoundException();

        if (!order.invoiceId)
            throw new NotFoundException();


        const result = this.httpRequest.post(`${process.env.DELIVERY_URL}/api`)
            .query({url: `/v1/sales/${order.invoiceId}`, method: 'GET'})
            .setHeader('x-access-token', this.persistedConfigService.get("STORM_BRANCH_TOKEN").value)
            .execute();

        if (!result)
            throw new NotFoundException();

        return result;
    }

}