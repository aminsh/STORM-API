import { inject, injectable } from "inversify";

@injectable()
export class InputPurchaseMapper {
    @inject("InputMapper")
    /**@type{InputMapper}*/ inputMapper = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;

    map(id) {
        const input = this.inventoryRepository.findById(id);

        let model = this.inputMapper.map(id);
         model.vat = input.inventoryLines.asEnumerable().sum(item => item.vat);
         model.tax = input.inventoryLines.asEnumerable().sum(item => item.tax);

         return model;
    }
}