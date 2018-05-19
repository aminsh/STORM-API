import {inject, injectable} from "inversify";

@injectable()
export class InventoryDomainService {

    @inject("InventoryRepository")
    /** @type {InventoryRepository} */ inventoryRepository = undefined;

    /**
     * @param {{stockIds: String[], minDate: String, maxDate: String}} dto
     **/
    fixQuantity(dto) {
        let inventories = this.inventoryRepository.findAll(dto);

        this.inventoryRepository.update(inventories.map(item => item.id), {fixedQuantity: true});
    }
}