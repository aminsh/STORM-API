import {inject, injectable} from "inversify";

@injectable()
export class TreasuryEventListener {

    /**@type {TreasurySettingRepository}*/
    @inject("TreasurySettingRepository") treasurySettingRepository = undefined;

    /**@type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    onReceiveCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveCash", [treasuryId]);
        this.commandBus.send("cashSetJournal", [treasuryId, journalId]);
    }

    onPaymentCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentCash", [treasuryId]);
        this.commandBus.send("cashSetJournal", [treasuryId, journalId]);
    }

    onReceiveReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveReceipt", [treasuryId]);
        this.commandBus.send("receiptSetJournal", [treasuryId, journalId]);
    }

    onPaymentReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentReceipt", [treasuryId]);
        this.commandBus.send("receiptSetJournal", [treasuryId, journalId]);
    }

    onReceiveDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveDemandNote", [treasuryId]);
        this.commandBus.send("demandNoteSetJournal", [treasuryId, journalId]);
    }

    onPaymentDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentDemandNote", [treasuryId]);
        this.commandBus.send("demandNoteSetJournal", [treasuryId, journalId]);
    }

    onChequeCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForCheque", [treasuryId]);
        this.commandBus.send("chequeSetJournal", [treasuryId, journalId]);
    }

    onChequeStatusChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForCheque", [treasuryId]);
        this.commandBus.send("chequeSetJournal", [treasuryId, journalId]);
    }

    onTransferCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveCash", [treasuryId]);
        this.commandBus.send("transferSetJournal", [treasuryId, journalId]);
    }
}
