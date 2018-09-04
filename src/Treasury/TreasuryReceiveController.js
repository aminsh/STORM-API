import {Controller, Get, Post, Put, Delete} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/treasury/receives", "ShouldHaveBranch")
class TreasuryReceiveController {

    @inject("TreasuryReceiveQuery")
    /**@type{TreasuryReceiveQuery}*/ treasuryReceiveQuery = undefined;

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
    getAll(req) {

        return this.treasuryReceiveQuery.getAll(req.query);
    }

    @Get("/cheques")
    getAllCheques(req) {

        return this.treasuryReceiveQuery.getAllCheques(req.query);
    }

    @Post("/cheques")
    createCheque(req) {

        const id = this.treasuryChequeService.createReceive(req.body);
        this.treasuryChequeService.chequeInFund(id, req.body);
        return this.treasuryReceiveQuery.getById(id, 'cheque');
    }

    @Get("/cheques/:id")
    getChequeById(req) {

        return this.treasuryReceiveQuery.getById(req.params.id, 'cheque');
    }

    @Put("/cheques/:id")
    updateCheque(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryReceiveQuery.getById(id, 'cheque');
    }

    @Delete("/cheques/:id")
    removeCheque(req) {

        this.treasuryChequeService.remove(req.params.id);
    }

    @Put("/cheques/:id/pass")
    passCheque(req) {

        this.treasuryChequeService.receiveChequePass(req.params.id, req.body);
    }

    @Put("/cheques/:id/in-process")
    setChequeInProgress(req) {

        this.treasuryChequeService.chequeInProcess(req.params.id, req.body);
    }

    @Put("/cheques/:id/in-fund")
    setChequeInFund(req) {

        this.treasuryChequeService.chequeInFund(req.params.id, req.body);
    }

    @Put("/cheques/:id/missing")
    setChequeMissing(req) {

        this.treasuryChequeService.chequeMissing(req.params.id, req.body);
    }

    @Put("/cheques/:id/return")
    returnCheque(req) {

        this.treasuryChequeService.chequeReturn(req.params.id, req.body);
    }

    @Put("/cheques/:id/revocation")
    revocateCheque(req) {

        this.treasuryChequeService.chequeRevocation(req.params.id, req.body);
    }

    @Post("/cheques/:id/generate-journal")
    generateJournalForCheque(req) {

        const journalId = this.treasuryJournalGenerationService.generateForCheque(req.params.id);

        this.treasuryChequeService.setJournal(req.params.id, journalId);
    }

    @Post("/cash")
    createCash(req) {

        const id = this.treasuryCashService.createReceive(req.body);

        return this.treasuryReceiveQuery.getById(id, 'cash');
    }

    @Get("/cash/:id")
    getCashById(req) {

        return this.treasuryReceiveQuery.getById(req.params.id, 'cash');
    }

    @Put("/cash/:id")
    updateCash(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryReceiveQuery.getById(id, 'cash');
    }

    @Delete("/cash/:id")
    removeCash(req) {

        this.treasuryCashService.remove(req.params.id);
    }

    @Post("/cash/:id/generate-journal")
    generateJournalForCash(req) {

        const journalId = this.treasuryJournalGenerationService.generateForReceiveCash(req.params.id);

        this.treasuryCashService.setJournal(req.params.id, journalId);
    }

    @Post("/receipts")
    createReceipt(req) {

        const id = this.treasuryReceiptService.createReceive(req.body);

        return this.treasuryReceiveQuery.getById(id, 'receipt');
    }

    @Get("/receipts/:id")
    getReceiptById(req) {

        return this.treasuryReceiveQuery.getById(req.params.id, 'receipt');
    }

    @Put("/receipts/:id")
    updateReceipt(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryReceiveQuery.getById(id, 'receipt');
    }

    @Delete("/receipts/:id")
    removeReceipt(req) {

        this.treasuryReceiptService.remove(req.params.id);
    }

    @Post("/receipts/:id/generate-journal")
    generateJournalForReceipt(req) {

        const journalId = this.treasuryJournalGenerationService.generateForReceiveReceipt(req.params.id);

        this.treasuryReceiptService.setJournal(req.params.id, journalId);
    }

    @Post("/demand-notes")
    createDemandNote(req) {

        const id = this.treasuryDemandNoteService.createReceive(req.body);

        return this.treasuryReceiveQuery.getById(id, 'demandNote');
    }

    @Get("/demand-notes/:id")
    getDemandNoteById(req) {

        return this.treasuryReceiveQuery.getById(req.params.id, 'demandNote');
    }

    @Put("/demand-notes/:id")
    updateDemandNote(req) {

        const id = req.params.id;

        this.treasuryService.update(id, req.body);

        return this.treasuryReceiveQuery.getById(id, 'demandNote');
    }

    @Delete("/demand-notes/:id")
    removeDemandNote(req) {

        this.treasuryDemandNoteService.remove(req.params.id);
    }

    @Post("/demand-notes/:id/generate-journal")
    generateJournalForDemandNote(req) {

        const journalId = this.treasuryJournalGenerationService.generateForReceiveDemandNote(req.params.id);

        this.treasuryDemandNoteService.setJournal(req.params.id, journalId);
    }

    @Post("/purposes/invoice")
    createTreasuryPurpose(req) {

        const cmd = req.body;

        cmd.treasury.treasuryType = 'receive';
        cmd.reference = 'invoice';

        const id = this.treasuryPurposeService.create(cmd);

        return id;
    }

    @Get("/purposes/invoice/:id")
    getTreasuryPurposeById(req) {

        return this.treasuryPurposeQuery.getByInvoiceId(req.params.id, req.query);
    }
}