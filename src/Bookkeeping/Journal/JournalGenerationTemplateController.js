import { Controller, Get, Post, Put, Delete } from "../../Infrastructure/expressUtlis";
import { inject } from "inversify";

@Controller("/v1/journal-generation-templates", "ShouldHaveBranch")
class JournalGenerationTemplateController {

    @inject("JournalGenerationTemplateService")
    /**@type{JournalGenerationTemplateService}*/ journalGenerationTemplateService = undefined;

    @inject("JournalGenerationTemplateQuery")
    /**@type{JournalGenerationTemplateQuery}*/ journalGenerationTemplateQuery = undefined;

    @Get("/")
    getAll(req) {
        return this.journalGenerationTemplateQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {
        return this.journalGenerationTemplateQuery.getById(req.params.id);
    }

    @Get('/model/:model')
    getModel(req) {
        return this.journalGenerationTemplateQuery.getByModel(req.params.model);
    }

    @Post("/")
    create(req) {
        const id = this.journalGenerationTemplateService.create(req.body);

        return this.journalGenerationTemplateQuery.getById(id);
    }

    @Put("/:id")
    update(req) {
        const id = req.params.id;

        this.journalGenerationTemplateService.update(id, req.body);

        return this.journalGenerationTemplateQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {
        const id = req.params.id;
        this.journalGenerationTemplateService.remove(id);
    }

    @Post('/:sourceType/custom-template')
    createCustomTemplate(req) {

        const sourceType = req.params.sourceType;

        this.journalGenerationTemplateService.createCustomTemplate(sourceType, req.body);

        return this.journalGenerationTemplateQuery.getBySourceType(sourceType);
    }
}