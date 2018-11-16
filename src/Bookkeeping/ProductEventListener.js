import {inject, injectable} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class ProductEventListener {

    @inject("ProductRepository")
    /**@type{ProductRepository}*/ productRepository = undefined;

    @inject("SettingsRepository")
    /**@type{SettingsRepository}*/ settingsRepository = undefined;

    @inject("DetailAccountService")
    /**@type{DetailAccountService}*/ detailAccountService = undefined;

    @inject("DimensionService")
    /**@type{DimensionService}*/ dimensionService = undefined;

    @EventHandler("ProductCreated")
    onProductCreated(productId) {

        const settings = this.settingsRepository.get(),
            product = this.productRepository.findById(productId);

        if (!settings.productAccountLevel)
            return;

        let entity = {
            title: product.title,
            detailAccountType: 'product'
        };

        if (settings.productAccountLevel === 'detailAccount')
            entity.id = this.detailAccountService.create(entity);

        if(settings.productAccountLevel === 'dimension1')
            entity.id = this.dimensionService.createDimension(1, entity);

        if(settings.productAccountLevel === 'dimension2')
            entity.id = this.dimensionService.createDimension(2, entity);

        if(settings.productAccountLevel === 'dimension3')
            entity.id = this.dimensionService.createDimension(3, entity);

        this.productRepository.update(productId, {accountId: entity.id});
    }
}