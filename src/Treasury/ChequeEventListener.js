import {inject, injectable} from "inversify";
import {eventHandler} from "../Infrastructure/@decorators";

@injectable()
export class ChequeEventListener {

    @inject("PayableChequeService")
    /** @type {PayableChequeService}*/payableChequeService = undefined;

    @inject("TreasuryRepository")
    /** @type {TreasuryRepository}*/ treasuryRepository = undefined;

    @eventHandler("onChequeStatusChanged")
    onIssued(treasuryPayableChequeId) {

        let treasuryPayableCheque = this.treasuryRepository.findById(treasuryPayableChequeId);

        this.payableChequeService.issue(
            treasuryPayableCheque.documentDetail.number,
            treasuryPayableCheque.sourceDetailAccountId,
            treasuryPayableChequeId);
    }
}