import {Controller, Get, Post} from "../core/expressUtlis";
import {inject} from "inversify";
import {async} from "../core/@decorators";

@Controller("/v1/storm-orders")
class OrderController {

    @inject("OrderQuery")
    /** @type {OrderQuery}*/ orderQuery = undefined;

    @inject("StormOrderService")
    /** @type {StormOrderService}*/ orderService = undefined;

    @inject("PlanQuery")
    /** @type {PlanQuery}*/ planQuery = undefined;

    @Post("/")
    @async()
    create(req) {

        let result = this.orderService.create(req.body);

        return result;
    }

    @Post("/trial")
    @async()
    createTrial(req) {

        let branchId = req.body.branchId,
            plan = this.planQuery.find({name: 'Trial'}, true);

        let result = this.orderService.create({branchId, planId: plan.id });

        this.orderService.confirm(result.id);
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.orderQuery.find(req.params.id);
    }

    @Post("/:id/confirm")
    @async()
    confirm(req) {

        let result = this.orderService.confirm(req.params.id);

        return result;
    }

    @Get("/:id/payment/callback")
    @async()
    paymentCallback(req, res) {

        if (req.query.status !== 'fail')
            this.orderService.setAsPaid(req.params.id);

        res.redirect(`${process.env.DASHBOARD_URL}/branch/order/${req.params.id}/payment-result?payment_status=${req.query.status}`);

    }
}