import {Controller, Get, Post, Put, Delete} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/treasury/transfers", "ShouldHaveBranch")
class TreasuryTransferController {

    @inject("TreasuryTransferQuery")
    /**@type{TreasuryTransferQuery}*/ treasuryTransferQuery = undefined;

    @inject("TreasuryTransferService")
    /**@type{TreasuryTransferService}*/ treasuryTransferService = undefined;

    @inject("TreasuryJournalGenerationService")
    /**@type{TreasuryJournalGenerationService}*/ treasuryJournalGenerationService = undefined;


    @Get("/")
    @async()
    getAll(req){

        return this.treasuryTransferQuery.getAll(req.query);
    }

    @Post("/")
    @async()
    create(req){

        const id = this.treasuryTransferService.create(req.body);

        return this.treasuryTransferQuery.getById(id);
    }

    @Get("/:id")
    @async()
    getById(req){

        return this.treasuryTransferQuery.getById(req.params.id);
    }

    @Put("/:id")
    @async()
    update(req){

        const id = req.params.id;

        this.treasuryTransferService.update(id, req.body);

        return this.treasuryTransferQuery.getById(id);
    }

    @Delete("/:id")
    @async()
    remove(req){

       this.treasuryTransferService.remove(req.params.id);
    }

    @Post("/:id/generate-journal")
    @async()
    generateJournal(req){

        const journalId = this.treasuryJournalGenerationService.generateForTransfer(req.params.id);

        this.treasuryTransferService.setJournal(req.params.id, journalId);
    }
}