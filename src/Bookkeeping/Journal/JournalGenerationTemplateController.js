import {Controller, Get, Post} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/journal-generation-templates", "ShouldHaveBranch")
class JournalGenerationTemplateController {

    @inject("JournalGenerationTemplateService")
    /**@type{JournalGenerationTemplateService}*/ journalGenerationTemplateService = undefined;

    @inject("JournalGenerationTemplateQuery")
    /**@type{JournalGenerationTemplateQuery}*/ journalGenerationTemplateQuery = undefined;

    @Get("/:sourceType")
    getBySourceType(req) {

        return this.journalGenerationTemplateQuery.getBySourceType(req.params.sourceType);
    }

    @Post("/:sourceType")
    createOrUpdate(req) {

        const sourceType = req.params.sourceType;

        this.journalGenerationTemplateService.createJournalTemplate(sourceType, req.body);

        return this.journalGenerationTemplateQuery.getBySourceType(sourceType);
    }

    @Post('/:sourceType/custom-template')
    createCustomTemplate(req) {

        const sourceType = req.params.sourceType;

        this.journalGenerationTemplateService.createCustomTemplate(sourceType, req.body);

        return this.journalGenerationTemplateQuery.getBySourceType(sourceType);
    }
}