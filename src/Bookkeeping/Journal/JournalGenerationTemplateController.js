import {Controller, Get, Post} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/journal-generation-templates", "ShouldHaveBranch")
class JournalGenerationTemplateController {

    @inject("JournalGenerationTemplateService")
    /**@type{JournalGenerationTemplateService}*/ journalGenerationTemplateService = undefined;

    @inject("JournalGenerationTemplateQuery")
    /**@type{JournalGenerationTemplateQuery}*/ journalGenerationTemplateQuery = undefined;

    @Get("/:sourceType")
    getBySourceType(req){

        return this.journalGenerationTemplateQuery.getBySourceType(req.params.sourceType);
    }

    @Post("/:sourceType")
    createOrUpdate(req){

        this.journalGenerationTemplateService.createJournalTemplate(req.params.sourceType, req.body);
    }
}