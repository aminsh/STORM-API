import {inject, injectable} from "inversify";
import {EventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class TreasuryEventListener {

    /**@type {TreasurySettingRepository}*/
    @inject("TreasurySettingRepository") treasurySettingRepository = undefined;

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

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

    @EventHandler("onReceiveCashCreated")
    onReceiveCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForReceiveCash(treasuryId);
        this.treasuryCashService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onReceiveCashChanged")
    onReceiveCashChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForReceiveCash(treasuryId);
    }

    @EventHandler("onPaymentCashCreated")
    onPaymentCashCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForPaymentCash(treasuryId);
        this.treasuryCashService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onPaymentCashChanged")
    onPaymentCashChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForPaymentCash(treasuryId);
    }

    @EventHandler("onReceiveReceiptCreated")
    onReceiveReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForReceiveReceipt(treasuryId);
        this.treasuryReceiptService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onReceiveReceiptChanged")
    onReceiveReceiptChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForReceiveReceipt(treasuryId);
    }

    @EventHandler("onPaymentReceiptCreated")
    onPaymentReceiptCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForPaymentReceipt(treasuryId);
        this.treasuryReceiptService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onPaymentReceiptChanged")
    onPaymentReceiptChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForPaymentReceipt(treasuryId);
    }

    @EventHandler("onReceiveDemandNoteCreated")
    onReceiveDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForReceiveDemandNote(treasuryId);
        this.treasuryDemandNoteService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onReceiveDemandNoteChanged")
    onReceiveDemandNoteChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForReceiveDemandNote(treasuryId);
    }

    @EventHandler("onPaymentDemandNoteCreated")
    onPaymentDemandNoteCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForPaymentDemandNote(treasuryId);
        this.treasuryDemandNoteService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onPaymentDemandNoteChanged")
    onPaymentDemandNoteChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForPaymentDemandNote(treasuryId);
    }

    @EventHandler("onChequeCreated")
    onChequeCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForCheque(treasuryId);
        this.treasuryChequeService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onReceiveChequeChanged")
    onReceiveChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForCheque(treasuryId);
    }

    @EventHandler("onPaymentChequeChanged")
    onPaymentChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForCheque(treasuryId);
        this.treasuryChequeService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onPaymentSpendChequeChanged")
    onPaymentSpendChequeChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForCheque(treasuryId);
    }

    @EventHandler("onChequeStatusChanged")
    onChequeStatusChanged(treasuryId) {
        this.onChequeCreated(treasuryId);
    }

    @EventHandler("onTransferCreated")
    onTransferCreated(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        const journalId = this.treasuryJournalGenerationService.generateForTransfer(treasuryId);
        this.treasuryTransferService.setJournal(treasuryId, journalId);
    }

    @EventHandler("onTransferTransferChanged")
    onTransferTransferChanged(treasuryId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryJournalGenerationService.generateForTransfer(treasuryId);
    }

    @EventHandler("onRemoveTreasuryJournal")
    onRemoveTreasuryJournal(journalId) {
        let settings = this.settingsRepository.get();

        if (!settings.canRemoveJournalWhenSourceRemoved)
            return;

        this.journalService.remove(journalId);
    }

    @EventHandler("onTreasuryPurposeRemove")
    onTreasuryPurposeRemove(journalId) {

        let settings = this.settingsRepository.get();

        if (!settings.canRemoveJournalWhenSourceRemoved)
            return;

        this.treasuryPurposeService.remove(journalId);
    }

    @EventHandler("onRemoveReceiveSpendChequeJournal")
    onRemoveReceiveSpendChequeJournal(journalId) {
        let treasurySetting = this.treasurySettingRepository.get();

        if (!treasurySetting.journalGenerateAutomatic)
            return;

        this.treasuryChequeService.removeReceiveSpendCheque(journalId);
    }
}
