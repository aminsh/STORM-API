import {inject, injectable} from "inversify";
import {eventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class TreasuryEventListener {

    /**@type {TreasurySettingRepository}*/
    @inject("TreasurySettingRepository") treasurySettingRepository = undefined;

    /**@type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    /**@type {TreasuryJournalGenerationService}*/
    @inject("TreasuryJournalGenerationService") treasuryJournalGenerationService = undefined;

    @inject("TreasuryCashService")
    /**@type{TreasuryCashService}*/ treasuryCashService = undefined;

    @inject("TreasuryReceiptService")
    /**@type{TreasuryReceiptService}*/ treasuryReceiptService = undefined;

    @inject("TreasuryDemandNoteService")
    /**@type{TreasuryDemandNoteService}*/ treasuryDemandNoteService = undefined;

    @inject("TreasuryChequeService")
    /**@type{TreasuryChequeService}*/ treasuryChequeService = undefined;

    @inject("TreasuryTransferService")
    /**@type{TreasuryTransferService}*/ treasuryTransferService = undefined;

    @inject("TreasuryPurposeService")
    /**@type{TreasuryPurposeService}*/ treasuryPurposeService = undefined;

    @eventHandler("onReceiveCashCreated")
    onReceiveCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForReceiveCash(treasuryId);
        this.treasuryCashService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onReceiveCashChanged")
    onReceiveCashChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForReceiveCash(treasuryId);
    }

    @eventHandler("onPaymentCashCreated")
    onPaymentCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForPaymentCash(treasuryId);
        this.treasuryCashService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onPaymentCashChanged")
    onPaymentCashChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForPaymentCash(treasuryId);
    }

    @eventHandler("onReceiveReceiptCreated")
    onReceiveReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForReceiveReceipt(treasuryId);
        this.treasuryReceiptService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onReceiveReceiptChanged")
    onReceiveReceiptChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForReceiveReceipt(treasuryId);
    }

    @eventHandler("onPaymentReceiptCreated")
    onPaymentReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForPaymentReceipt(treasuryId);
        this.treasuryReceiptService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onPaymentReceiptChanged")
    onPaymentReceiptChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForPaymentReceipt(treasuryId);
    }

    @eventHandler("onReceiveDemandNoteCreated")
    onReceiveDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForReceiveDemandNote(treasuryId);
        this.treasuryDemandNoteService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onReceiveDemandNoteChanged")
    onReceiveDemandNoteChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForReceiveDemandNote(treasuryId);
    }

    @eventHandler("onPaymentDemandNoteCreated")
    onPaymentDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForPaymentDemandNote(treasuryId);
        this.treasuryDemandNoteService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onPaymentDemandNoteChanged")
    onPaymentDemandNoteChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForPaymentDemandNote(treasuryId);
    }

    @eventHandler("onChequeCreated")
    onChequeCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForCheque(treasuryId);
        this.treasuryChequeService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onReceiveChequeChanged")
    onReceiveChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForCheque(treasuryId);
    }

    @eventHandler("onPaymentChequeChanged")
    onPaymentChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForCheque(treasuryId);
        this.treasuryChequeService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onPaymentSpendChequeChanged")
    onPaymentSpendChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForCheque(treasuryId);
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

        const journalId = this.treasuryJournalGenerationService.generateForTransfer(treasuryId);
        this.treasuryTransferService.setJournal(treasuryId, journalId);
    }

    @eventHandler("onTransferTransferChanged")
    onTransferTransferChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForTransfer(treasuryId);
    }

    @eventHandler("onRemoveTreasuryJournal")
    onRemoveTreasuryJournal(journalId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.journalService.remove(journalId);
    }

    @eventHandler("onTreasuryPurposeRemove")
    onTreasuryPurposeRemove(journalId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryPurposeService.remove(journalId);
    }

    @eventHandler("onRemoveReceiveSpendChequeJournal")
    onRemoveReceiveSpendChequeJournal(journalId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryChequeService.removeReceiveSpendCheque(journalId);
    }
}
