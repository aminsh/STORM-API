import {inject, injectable} from "inversify";
import {eventHandler} from "../../core/@decorators";

@injectable()
export class ChequeEventListener {

    @inject("PayableChequeDomainService")
    /** @type {PayableChequeDomainService}*/payableChequeDomainService = undefined;

    @eventHandler("onChequeIssued")
    onIssued(treasuryPayableCheque) {

        this.payableChequeDomainService.issue(
            treasuryPayableCheque.documentDetail.number,
            treasuryPayableCheque.sourceDetailAccountId);
    }
}