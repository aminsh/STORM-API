import {inject, injectable} from "inversify";
import {eventHandler} from "../../core/@decorators";

@injectable()
export class TreasuryEventListener {

    /**@type {TreasurySettingRepository}*/
    @inject("TreasurySettingRepository") treasurySettingRepository = undefined;

    /**@type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;


    @eventHandler("onReceiveCashCreated")
    onReceiveCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveCash", [treasuryId]);
        this.commandBus.send("cashSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onPaymentCashCreated")
    onPaymentCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentCash", [treasuryId]);
        this.commandBus.send("cashSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onReceiveReceiptCreated")
    onReceiveReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveReceipt", [treasuryId]);
        this.commandBus.send("receiptSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onPaymentReceiptCreated")
    onPaymentReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentReceipt", [treasuryId]);
        this.commandBus.send("receiptSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onReceiveDemandNoteCreated")
    onReceiveDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveDemandNote", [treasuryId]);
        this.commandBus.send("demandNoteSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onPaymentDemandNoteCreated")
    onPaymentDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentDemandNote", [treasuryId]);
        this.commandBus.send("demandNoteSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onChequeCreated")
    onChequeCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForCheque", [treasuryId]);
        this.commandBus.send("chequeSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onChequeStatusChanged")
    onChequeStatusChanged(treasuryId) {
        this.onChequeCreated(treasuryId);
    }

    @eventHandler("onTransferCreated")
    onTransferCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForTransfer", [treasuryId]);
        this.commandBus.send("transferSetJournal", [treasuryId, journalId]);
    }
}
