import {injectable, inject} from "inversify";
import {eventHandler} from "../Infrastructure/@decorators";

@injectable()
export class ProductInventoryEventListener {

    @inject("ProductInventoryService")
    /**@type{ProductInventoryService}*/ productInventoryService = undefined;


    @eventHandler("ProductInventoryChanged")
    onSaleCreated(productId, stockId, quantity) {

        this.productInventoryService.start();

        try {
            this.productInventoryService.changedQuantity(...arguments);

            this.productInventoryService.commitChanges();
        }
        catch (e){

            this.productInventoryService.revertChanges();

            throw new Error(e);
        }
    }

}