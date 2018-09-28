import {injectable, inject} from "inversify";

@injectable()
export class JournalTemplateService {

    @inject("JournalTemplateRepository")
    /**@type{JournalTemplateRepository}*/ journalTemplateRepository = undefined;

    @inject("JournalService")
    /**@type{JournalService}*/ journalService = undefined;

    create(dto){

        let entity = {
            title: dto.title,
            journalId: dto.journalId
        };

        this.journalTemplateRepository.create(entity);

        return entity.id;
    }

    update(id, dto){

        let entity = {
            title: dto.title,
            journalId: dto.journalId
        };

        this.journalTemplateRepository.update(id, entity);
    }

    remove(id){

        this.journalTemplateRepository.remove(id);
    }

    copy(id){

        const template = this.journalTemplateRepository.findById(id);

        return this.journalService.clone(template.journalId);
    }

}