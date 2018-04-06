import {inject, injectable} from "inversify";
import {eventHandler} from "../../core/@decorators";

@injectable()
export class ChequeEventListener {

    @inject("PayableChequeDomainService")
    /** @type {PayableChequeDomainService}*/payableChequeDomainService = undefined;

    @inject("TreasuryRepository")
    /** @type {TreasuryRepository}*/ treasuryRepository = undefined;

    @eventHandler("onChequeCreated")
    onIssued(treasuryPayableChequeId) {

        let treasuryPayableCheque = this.treasuryRepository.findById(treasuryPayableChequeId);

        this.payableChequeDomainService.issue(
            treasuryPayableCheque.documentDetail.number,
            treasuryPayableCheque.sourceDetailAccountId,
            treasuryPayableChequeId);
    }
}