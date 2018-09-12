import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class ProductInventoryEventListener {

    @inject("ProductInventoryService")
    /**@type{ProductInventoryService}*/ productInventoryService = undefined;


    @EventHandler("ProductInventoryChanged")
    onSaleCreated(productId, stockId, quantity) {

        this.productInventoryService.start();

        try {
            this.productInventoryService.set(...arguments);

            this.productInventoryService.commitChanges();
        }
        catch (e){

            this.productInventoryService.revertChanges();

            throw new Error(e);
        }
    }

}