import {Controller, Get, Post, Put, Delete} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/treasury/payments", "ShouldHaveBranch")
class TreasuryPaymentController {

    @inject("TreasuryPaymentQuery")
    /**@type{TreasuryPaymentQuery}*/ treasuryPaymentQuery = undefined;

    @inject("TreasuryChequeService")
    /**@type{TreasuryChequeService}*/ treasuryChequeService = undefined;

    @inject("TreasuryCashService")
    /**@type{TreasuryCashService}*/ treasuryCashService = undefined;

    @inject("TreasuryReceiptService")
    /**@type{TreasuryReceiptService}*/ treasuryReceiptService = undefined;

    @inject("TreasuryDemandNoteService")
    /**@type{TreasuryDemandNoteService}*/ treasuryDemandNoteService = undefined;

    @inject("TreasuryService")
    /**@type{TreasuryService}*/ treasuryService = undefined;

    @inject("TreasuryPurposeService")
    /** @type{TreasuryPurposeService}*/ treasuryPurposeService = undefined;

    @inject("TreasuryPurposeQuery")
    /** @type{TreasuryPurposeQuery}*/ treasuryPurposeQuery = undefined;

    @inject("TreasuryJournalGenerationService")
    /**@type{TreasuryJournalGenerationService}*/ treasuryJournalGenerationService = undefined;

    @Get("/")
    @async()
    getAll(req) {

        return this.treasuryPaymentQuery.getAll(req.query);
    }

    @Post("/cheques")
    @async()
    createCheque(req) {

        const id = this.treasuryChequeService.createPayment(req.body);

        return this.treasuryPaymentQuery.getById(id, 'cheque');
    }

    @Get("/cheques/:id")
    @async()
    getChequeById(req) {

        return this.treasuryPaymentQuery.getById(req.params.id, 'cheque');
    }

    @Put("/cheques/:id")
    @async()
    updateCheque(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryPaymentQuery.getById(id, 'cheque');
    }

    @Delete("/cheques/:id")
    @async()
    removeCheque(req) {

        this.treasuryChequeService.remove(req.params.id);
    }

    @Put("/cheques/:id/pass")
    @async()
    passCheque(req) {

        this.treasuryChequeService.paymentChequePass(req.params.id, req.body);
    }

    @Put("/cheques/:id/in-process")
    @async()
    setChequeInProgress(req) {

        this.treasuryChequeService.chequeInProcess(req.params.id, req.body);
    }

    @Put("/cheques/:id/return")
    @async()
    returnCheque(req) {

        this.treasuryChequeService.chequeReturn(req.params.id, req.body);
    }

    @Put("/cheques/:id/revocation")
    @async()
    revocateCheque(req) {

        this.treasuryChequeService.chequeRevocation(req.params.id, req.body);
    }

    @Post("/cheques/:id/generate-journal")
    @async()
    generateJournalForCheque(req) {

        const journalId = this.treasuryJournalGenerationService.generateForCheque(req.params.id);

        this.treasuryChequeService.setJournal(req.params.id, journalId);
    }

    @Post("/spend-cheque")
    @async()
    createSpendCheque(req) {

        const id = this.treasuryChequeService.chequeSpend(req.body);

        return this.treasuryPaymentQuery.getById(id, 'spendCheque');
    }

    @Get("/spend-cheques/:id")
    @async()
    getSpendCheque(req) {

        return this.treasuryPaymentQuery.getById(req.params.id, 'spendCheque');
    }

    @Put("/spend-cheques/:id")
    @async()
    updateSpendCheuqe(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryPaymentQuery.getById(id, 'spendCheque');
    }

    @Delete("/spend-cheques/:id")
    @async()
    remvoeSpendCheque(req) {

        this.treasuryChequeService.remove(req.params.id);
    }

    @Put("/spend-cheques/:id/return")
    @async()
    returnSpendCheque(req) {

        this.treasuryChequeService.spentChequeReturn(req.params.id, req.body);
    }

    @Post("/spend-cheques/:id/generate-journal")
    @async()
    generateJournalForSpendCheque(req) {

        const journalId = this.treasuryJournalGenerationService.generateForCheque(req.params.id);

        this.treasuryChequeService.setJournal(req.params.id, journalId);
    }

    @Post("/cash")
    @async()
    createCash(req) {

        const id = this.treasuryCashService.createPayment(req.body);

        return this.treasuryPaymentQuery.getById(id, 'cash');
    }

    @Get("/cash/:id")
    @async()
    getChashById(req) {

        return this.treasuryPaymentQuery.getById(req.params.id, 'cash');
    }

    @Put("/cash/:id")
    @async()
    updateCash(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryPaymentQuery.getById(id, 'cash');
    }

    @Delete("/cash/:id")
    @async()
    removeChash(req) {

        this.treasuryCashService.remove(req.params.id);
    }

    @Post("/cash/:id/generate-journal")
    @async()
    generateJournalForChash(req) {

        const journalId = this.treasuryJournalGenerationService.generateForPaymentCash(req.params.id);

        this.treasuryCashService.setJournal(req.params.id, journalId);
    }

    @Post("/receipts")
    @async()
    createReceipt(req) {

        const id = this.treasuryReceiptService.createPayment(req.body);

        return this.treasuryPaymentQuery.getById(id, 'receipt');
    }

    @Get("/receipts/:id")
    @async()
    getReceiptById(req) {

        return this.treasuryPaymentQuery.getById(req.params.id, 'receipt');
    }

    @Put("/receipts/:id")
    @async()
    updateReceipt(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryPaymentQuery.getById(id, 'receipt');
    }

    @Delete("/receipts/:id")
    @async()
    removeReceipt(req) {

        this.treasuryReceiptService.remove(req.params.id);
    }

    @Post("/receipts/:id/generate-journal")
    @async()
    generateJournalForReceipt(req) {

        const journalId = this.treasuryJournalGenerationService.generateForPaymentReceipt(req.params.id);

        this.treasuryReceiptService.setJournal(req.params.id, journalId);
    }

    @Post("/demand-notes")
    @async()
    createDemandNote(req) {

        const id = this.treasuryDemandNoteService.createPayment(req.body);

        return this.treasuryPaymentQuery.getById(id, 'demandNote');
    }

    @Get("/demand-notes/:id")
    @async()
    getDemandNoteById(req) {

        return this.treasuryPaymentQuery.getById(req.params.id, 'demandNote');
    }

    @Put("/demand-notes/:id")
    @async()
    updateDemandNote(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryPaymentQuery.getById(id, 'demandNote');
    }

    @Delete("/demand-notes/:id")
    @async()
    removeDemandNote(req) {

        this.treasuryDemandNoteService.remove(req.params.id);
    }

    @Post("/demand-notes/:id/generate-journal")
    @async()
    generateJournalForDemandNote(req) {

        const journalId = this.treasuryJournalGenerationService.generateForPaymentDemandNote(req.params.id);

        this.treasuryDemandNoteService.setJournal(req.params.id, journalId);
    }

    @Post("/purposes/invoice")
    @async()
    createTreasuryPurpose(req) {

        const cmd = req.body;

        cmd.treasury.treasuryType = 'payment';

        const id = this.treasuryPurposeService.create(cmd);

        return id;
    }

    @Get("/purposes/invoice/:id")
    @async()
    getTreasuryPurposeById(req) {

        return this.treasuryPurposeQuery.getByInvoiceId(req.params.id, req.query);
    }
}