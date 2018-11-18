import {Controller, Post, Get} from "../../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/woocommerce", "ShouldHaveBranch")
class WoocommerceController {

    @inject("Woocommerce")
    /**@type{Woocommerce}*/ woocommerce = undefined;

    @inject("WoocommerceRepository") WoocommerceRepository = undefined;

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

    @Get("/products")
    getProductById(req){

        try{
            return this.WoocommerceRepository.get('products');

        }
        catch (e) {

            if(e.data.status === 404)
                throw new NotFoundException();

            if(e.data.status === 401)
                throw new ForbiddenException(e.message);

            if(e.data.status === 400)
                throw new ValidationSingleException(e.message);
        }
    }

    @Post('/products/sync')
    syncProducts(){

        this.woocommerce.syncProducts();
    }

}