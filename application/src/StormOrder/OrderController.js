import {Controller, Get, Post} from "../core/expressUtlis";
import {inject} from "inversify";
import {async} from "../core/@decorators";

@Controller("/v1/storm-orders")
class OrderController {

    @inject("OrderQuery")
    /** @type {OrderQuery}*/ orderQuery = undefined;

    @inject("StormOrderService")
    /** @type {StormOrderService}*/ orderService = undefined;

    @Post("/")
    @async()
    create(req, res) {
        try {
            let result = this.orderService.create(req.body);

            return result;
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors);

            res.sendStatus(500);
        }
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.orderQuery.find(req.params.id);
    }

    @Post("/:id/confirm")
    @async()
    confirm(req, res) {

        try {

            let result = this.orderService.confirm(req.params.id);

            res.send(result);
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors);

            res.sendStatus(500);
        }
    }

    @Get("/:id/payment/callback")
    @async()
    paymentCallback(req, res) {

        try {

            if (req.query.status !== 'fail')
                this.orderService.setAsPaid(req.params.id);

            res.redirect(`${process.env.DASHBOARD_URL}/branch/order/${req.params.id}/payment-result?payment_status=${req.query.status}`);
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors);

            res.status(500);
        }

    }
}