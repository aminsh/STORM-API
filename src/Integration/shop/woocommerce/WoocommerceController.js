import {Controller, Post} from "../../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/woocommerce", "ShouldHaveBranch")
class WoocommerceController {

    @inject("Woocommerce")
    /**@type{Woocommerce}*/ woocommerce = undefined;

    @Post('/add-order')
    addOrder(req){

        this.woocommerce.addOrder(req.body);
    }

    @Post('/update-order')
    updateOrder(req){

        this.woocommerce.updateOrder(req.body);
    }

    @Post("/delete-order")
    deleteOrder(req){

        this.woocommerce.deleteOrder(req.body);
    }

}