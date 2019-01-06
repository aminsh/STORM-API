import {Inject, Injectable} from "../../Infrastructure/DependencyInjection";
import {DetailAccountRepository} from "../Domain/DetailAccountRepository";
import {DetailAccountCreateDTO, DetailAccountUpdateDTO} from "./DetailAccountDTOs";
import {DetailAccount} from "../Domain/DetailAccount";
import {EntityState} from "../../Infrastructure/EntityState";

@Injectable()
export class DetailAccountService {

    @Inject("DetailAccountRepository") detailAccountRepository: DetailAccountRepository;

    /**@type {JournalRepository}*/
        //@Inject("JournalRepository") journalRepository = undefined;

    @Inject("Enums") enums = undefined;

    async create(dto: DetailAccountCreateDTO): Promise<string> {

        let entity = new DetailAccount();

        entity.title = dto.title;
        entity.code = dto.code;
        entity.description = dto.description;
        entity.reference = dto.referenceId;

        await this.detailAccountRepository.save(entity, EntityState.CREATED);

        return entity.id;
    }

    async update(dto: DetailAccountUpdateDTO): Promise<void> {
        let entity = await this.detailAccountRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        entity.code = dto.code;
        entity.title = dto.title;
        entity.description = dto.description;
        entity.reference = dto.referenceId;

        await this.detailAccountRepository.save(entity, EntityState.MODIFIED);
    }

    async remove(id: string): Promise<void> {
        let errors = [];

        let entity = await this.detailAccountRepository.findById(id);

        if (!entity)
            throw new NotFoundException();
        /*if (this.journalRepository.isExistsDetailAccount(id))
            errors.push('حساب تفصیل جاری در اسناد حسابداری استفاده شده ، امکان حذف وجود ندارد');*/

        /*if (errors.length > 0)
            throw new ValidationException(errors);*/

        await this.detailAccountRepository.remove(entity);
    }
}
