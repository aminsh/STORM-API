import { Body, Controller, Get, Parameters, Post, Query, Response } from "../Infrastructure/ExpressFramework";
import { Response as IResponse } from "../Infrastructure/ExpressFramework/Types";
import { OrderService } from "./order.service";
import { OrderCreateDTO } from "./order.DTO";
import { Configuration } from "../Config/Configuration";

@Controller('/v1/storm-orders')
export class OrderController {
    constructor(private readonly orderService: OrderService,
                private readonly config: Configuration) { }

    @Post('/')
    async create(@Body() dto: OrderCreateDTO): Promise<any> {
        return this.orderService.create(dto);
    }

    @Post('/:id/confirm')
    async confirm(@Parameters('id') id: string): Promise<any> {
        return this.orderService.confirm(id);
    }


    @Get('/:id/payment/callback')
    async paymentCallback(
        @Query('status') status: string,
        @Parameters('id') id: string,
        @Response() res: IResponse): Promise<void> {

        if (status !== 'fail')
            await this.orderService.setAsPaid(id);

        res.redirect(`${ this.config.DASHBOARD_URL }/branch/order/${ id }/payment-result?payment_status=${ status }`)
    }

}