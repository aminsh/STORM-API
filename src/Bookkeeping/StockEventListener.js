import {inject, injectable} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class StockEventListener {

    @inject("StockRepository")
    /**@type{StockRepository}*/ stockRepository = undefined;

    @inject("SettingsRepository")
    /**@type{SettingsRepository}*/ settingsRepository = undefined;

    @inject("DetailAccountService")
    /**@type{DetailAccountService}*/ detailAccountService = undefined;

    @inject("DimensionService")
    /**@type{DimensionService}*/ dimensionService = undefined;

    @EventHandler("StockCreated")
    onStockCreated(stockId) {

        const settings = this.settingsRepository.get(),
            stock = this.stockRepository.findById(stockId);

        if (!settings.stockAccountLevel)
            return;

        let entity = {
            title: stock.title,
            detailAccountType: 'stock'
        };

        if (settings.stockAccountLevel === 'detailAccount')
            entity.id = this.detailAccountService.create(entity);

        if(settings.stockAccountLevel === 'dimension1')
            entity.id = this.dimensionService.createDimension(1, entity);

        if(settings.stockAccountLevel === 'dimension2')
            entity.id = this.dimensionService.createDimension(2, entity);

        if(settings.stockAccountLevel === 'dimension3')
            entity.id = this.dimensionService.createDimension(3, entity);

        this.stockRepository.update(stockId, {accountId: entity.id});
    }
}