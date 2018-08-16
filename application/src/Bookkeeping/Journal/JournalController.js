import {Controller, Delete, Get, Post, Put} from "../../core/expressUtlis";
import {async} from "../../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/journals", "ShouldHaveBranch")
class JournalController {

    @inject("JournalService")
    /**@type{JournalService}*/ journalService = undefined;

    @inject("JournalQuery")
    /**@type{JournalQuery}*/ journalQuery = undefined;

    @Get("/")
    @async()
    getAll(req) {

        return this.journalQuery.getAll(req.query);
    }

    @Get("/total-info")
    @async()
    getTotalInfo() {

        return this.journalQuery.getTotalInfo();
    }

    @Get("/max-number")
    @async()
    getMaxNumber() {

        return this.journalQuery.getMaxNumber()
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.journalQuery.getById(req.params.id);
    }

    @Get("/by-number/:number")
    @async()
    getByNumber(req) {

        return this.journalQuery.getByNumber(req.params.number);
    }

    @Get("/summary/grouped-by-month")
    @async()
    getGroupByMonth() {

        return this.journalQuery.getGroupedByMouth();
    }

    @Get("/month/:month")
    @async()
    getByMonth(req) {

        return this.journalQuery.getJournalsByMonth(req.params.month, req.query);
    }

    @Get("/:id/lines")
    @async()
    getAllLines(req) {

        return this.journalQuery.getAllLinesById(req.params.id, req.query);
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.journalService.create(req.body);

        return this.journalQuery.getById(id);
    }

    @Put("/:id")
    @async()
    update(req) {

        const id = req.params.id;

        this.journalService.update(id, req.body);

        return this.journalQuery.getById(id);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.journalService.remove(req.params.id);
    }

    @Put("/:id/confirm")
    @async()
    confirm(req) {

        const id = req.params.id;

        this.journalService.fix(id);

        return this.journalQuery.getById(id);
    }

    @Put("/:id/attach-image")
    @async()
    attachImage(req) {

        this.journalService.attachImage(req.params.id, req.body.fileName);
    }

    @Post("/:id/copy")
    @async()
    copy(req) {

        const id = this.journalService.clone(req.params.id);

        return this.journalQuery.getById(id);
    }

    @Put("/:id/change-date")
    @async()
    changeDate(req) {

        const id = req.params.id;

        this.journalService.changeDate(id, req.body.date);

        return this.journalQuery.getById(id);
    }

    @Put("/ordering-number-by-date")
    @async()
    orderingNumberByDate() {

        this.journalService.orderingTemporaryNumberByTemporaryDate();
    }
}