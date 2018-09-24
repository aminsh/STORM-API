import {Controller, Delete, Get, Post, Put} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/journals", "ShouldHaveBranch")
class JournalController {

    @inject("JournalService")
    /**@type{JournalService}*/ journalService = undefined;

    @inject("JournalQuery")
    /**@type{JournalQuery}*/ journalQuery = undefined;

    @inject("JournalGenerationPurposeQuery")
    /**@type{JournalGenerationPurposeQuery}*/ journalGenerationPurposeQuery = undefined;

    @Get("/")
    getAll(req) {

        return this.journalQuery.getAll(req.query);
    }

    @Get("/total-info")
    getTotalInfo() {

        return this.journalQuery.getTotalInfo();
    }

    @Get("/max-number")
    getMaxNumber() {

        return this.journalQuery.getMaxNumber()
    }

    @Get("/generation-purposes")
    getAllJournalGenerationPurposes(req){

        return this.journalGenerationPurposeQuery.getAll(req.query)
    }

    @Get("/:id")
    getById(req) {

        return this.journalQuery.getById(req.params.id);
    }

    @Get("/by-number/:number")
    getByNumber(req) {

        return this.journalQuery.getByNumber(req.params.number);
    }

    @Get("/summary/grouped-by-month")
    getGroupByMonth() {

        return this.journalQuery.getGroupedByMouth();
    }

    @Get("/month/:month")
    getByMonth(req) {

        return this.journalQuery.getJournalsByMonth(req.params.month, req.query);
    }

    @Get("/:id/lines")
    getAllLines(req) {

        return this.journalQuery.getAllLinesById(req.params.id, req.query);
    }

    @Post("/")
    create(req) {

        const id = this.journalService.create(req.body);

        return this.journalQuery.getById(id);
    }

    @Put("/ordering-number-by-date")
    orderingNumberByDate() {

        this.journalService.orderingTemporaryNumberByTemporaryDate();
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.journalService.update(id, req.body);

        return this.journalQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.journalService.remove(req.params.id);
    }

    @Put("/:id/confirm")
    confirm(req) {

        const id = req.params.id;

        this.journalService.fix(id);

        return this.journalQuery.getById(id);
    }

    @Put("/:id/attach-image")
    attachImage(req) {

        this.journalService.attachImage(req.params.id, req.body.fileName);
    }

    @Post("/:id/copy")
    copy(req) {

        const id = this.journalService.clone(req.params.id);

        return this.journalQuery.getById(id);
    }

    @Put("/:id/change-date")
    changeDate(req) {

        const id = req.params.id;

        this.journalService.changeDate(id, req.body.date);

        return this.journalQuery.getById(id);
    }

    @Get("/generation-purposes/:id")
    getByIdJournalGenerationPurposes(req){
        return this.journalGenerationPurposeQuery.getById(req.params.id)
    }
}