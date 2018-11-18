import {Controller, Get, Post, WithoutControlPermissions} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/storm-orders")
@WithoutControlPermissions()
class OrderController {

    @inject("OrderQuery")
    /** @type {OrderQuery}*/ orderQuery = undefined;

    @inject("StormOrderService")
    /** @type {StormOrderService}*/ orderService = undefined;

    @inject("PlanQuery")
    /** @type {PlanQuery}*/ planQuery = undefined;

    @Post("/")
    create(req) {

        let result = this.orderService.create(req.body);

        return result;
    }

    @Post("/trial")
    createTrial(req) {

        let branchId = req.body.branchId,
            plan = this.planQuery.find({name: 'Trial'}, true);

        let result = this.orderService.create({branchId, planId: plan.id});

        this.orderService.confirm(result.id);
    }

    @Get("/:id")
    getById(req) {

        return this.orderQuery.find(req.params.id);
    }

    @Post("/:id/confirm")
    confirm(req) {

        let result = this.orderService.confirm(req.params.id);

        return result;
    }

    @Get("/:id/payment/callback")
    paymentCallback(req, res) {

        if (req.query.status !== 'fail')
            this.orderService.setAsPaid(req.params.id);

        res.redirect(`${process.env.DASHBOARD_URL}/branch/order/${req.params.id}/payment-result?payment_status=${req.query.status}`);

    }

    @Get('/:id/invoice')
    getInvoiceByOrder(req) {

        return this.orderQuery.getInvoiceByOrder(req.params.id);
    }
}