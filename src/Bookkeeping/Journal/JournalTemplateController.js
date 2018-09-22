import {Controller, Get, Post, Put, Delete} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/journal-templates", "ShouldHaveBranch")
class JournalTemplateController {

    @inject("JournalTemplateService")
    /**@type{JournalTemplateService}*/ journalTemplateService = undefined;

    @inject("JournalTemplateQuery")
    /**@type{JournalTemplateQuery}*/ journalTemplateQuery = undefined;

    @Get("/")
    getAll(req){

        return this.journalTemplateQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req){

        return this.journalTemplateQuery.getById(req.params.id);
    }

    @Post("/")
    create(req){

        const id = this.journalTemplateService.create(req.body);

        return this.journalTemplateQuery.getById(id);
    }

    @Put("/:id")
    update(req){

        const id = req.params.id;

        this.journalTemplateService.update(id, req.body);

        return this.journalTemplateQuery.getById(id);
    }

    @Delete("/:id")
    remove(req){

        this.journalTemplateService.remove(req.params.id);
    }

    @Post("/:id/copy")
    copy(req){

        const journalId = this.journalTemplateService.copy(req.params.id);

        return {id: journalId};
    }
}
