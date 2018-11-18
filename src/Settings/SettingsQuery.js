import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable} from "inversify";

@injectable()
export class SettingsQuery extends BaseQuery {

    get() {

        return toResult(this.knex.select(
            'vat',
            'tax',
            'bankId',
            'canControlInventory',
            'canCreateSaleOnNoEnoughInventory',
            'canSaleGenerateAutomaticJournal',
            'productOutputCreationMethod',
            'stockId',
            'stakeholders',
            'subsidiaryLedgerAccounts',
            'saleCosts',
            'saleCharges',
            'webhooks',
            'invoiceDescription',
            'productAccountLevel',
            'stockAccountLevel')
            .from('settings')
            .where('branchId', this.branchId)
            .first());
    }
}