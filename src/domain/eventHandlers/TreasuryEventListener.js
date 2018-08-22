import {inject, injectable} from "inversify";
import {eventHandler} from "../../Infrastructure/@decorators";

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

    @eventHandler("onReceiveCashChanged")
    onReceiveCashChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryReceiveCashJournalUpdate", [treasuryId]);
    }

    @eventHandler("onPaymentCashCreated")
    onPaymentCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentCash", [treasuryId]);
        this.commandBus.send("cashSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onPaymentCashChanged")
    onPaymentCashChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryPaymentCashJournalUpdate", [treasuryId]);
    }

    @eventHandler("onReceiveReceiptCreated")
    onReceiveReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveReceipt", [treasuryId]);
        this.commandBus.send("receiptSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onReceiveReceiptChanged")
    onReceiveReceiptChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryReceiveReceiptJournalUpdate", [treasuryId]);
    }

    @eventHandler("onPaymentReceiptCreated")
    onPaymentReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentReceipt", [treasuryId]);
        this.commandBus.send("receiptSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onPaymentReceiptChanged")
    onPaymentReceiptChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryPaymentReceiptJournalUpdate", [treasuryId]);
    }

    @eventHandler("onReceiveDemandNoteCreated")
    onReceiveDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForReceiveDemandNote", [treasuryId]);
        this.commandBus.send("demandNoteSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onReceiveDemandNoteChanged")
    onReceiveDemandNoteChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryReceiveDemandNoteJournalUpdate", [treasuryId]);
    }

    @eventHandler("onPaymentDemandNoteCreated")
    onPaymentDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForPaymentDemandNote", [treasuryId]);
        this.commandBus.send("demandNoteSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onPaymentDemandNoteChanged")
    onPaymentDemandNoteChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryPaymentDemandNoteJournalUpdate", [treasuryId]);
    }

    @eventHandler("onChequeCreated")
    onChequeCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        let journalId = this.commandBus.send("journalGenerateForCheque", [treasuryId]);
        this.commandBus.send("chequeSetJournal", [treasuryId, journalId]);
    }

    @eventHandler("onReceiveChequeChanged")
    onReceiveChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryReceiveChequeJournalUpdate", [treasuryId]);
    }

    @eventHandler("onPaymentChequeChanged")
    onPaymentChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryPaymentChequeJournalUpdate", [treasuryId]);
    }

    @eventHandler("onPaymentSpendChequeChanged")
    onPaymentSpendChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryPaymentChequeJournalUpdate", [treasuryId]);
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

    @eventHandler("onTransferTransferChanged")
    onTransferTransferChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryTransferJournalUpdate", [treasuryId]);
    }

    @eventHandler("onRemoveTreasuryJournal")
    onRemoveTreasuryJournal(journalId){
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryJournalRemove", [journalId]);
    }

    @eventHandler("onTreasuryPurposeRemove")
    onTreasuryPurposeRemove(journalId){
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("treasuryPurposeRemove", [journalId]);
    }

    @eventHandler("onRemoveReceiveSpendChequeJournal")
    onRemoveReceiveSpendChequeJournal(journalId){
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.commandBus.send("receiveSpendChequeJournalRemove", [journalId]);
    }
}
