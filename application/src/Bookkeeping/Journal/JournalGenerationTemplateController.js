import {Controller, Delete, Get, Post, Put} from "../../core/expressUtlis";
import {async} from "../../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/journal-generation-templates", "ShouldHaveBranch")
class JournalGenerationTemplateController {

    @inject("JournalGenerationTemplateService")
    /**@type{JournalGenerationTemplateService}*/ journalGenerationTemplateService = undefined;

    @inject("JournalGenerationTemplateQuery")
    /**@type{JournalGenerationTemplateQuery}*/ journalGenerationTemplateQuery = undefined;

    @Get("/:sourceType")
    @async()
    getBySourceType(req){

        return this.journalGenerationTemplateQuery.getBySourceType(req.params.sourceType);
    }

    @Post("/:sourceType")
    createOrUpdate(req){

        this.journalGenerationTemplateService.createJournalTemplate(req.params.sourceType, req.body);
    }
}