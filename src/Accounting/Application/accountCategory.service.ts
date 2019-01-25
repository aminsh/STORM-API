import {Inject, Injectable} from "../../Infrastructure/DependencyInjection";
import {AccountCategoryCreateDTO, AccountCategoryUpdateDTO} from "./accountCategory.DTO";
import {AccountCategoryRepository} from "../Domain/accountCategory.repository";
import {AccountCategoryEntity} from "../Domain/accountCategory.entity";
import {Not} from "typeorm";
import {Validate} from "../../Infrastructure/Validator/Validate";
import {BadRequestException, NotFoundException} from "../../Infrastructure/Exceptions";

@Injectable()
export class AccountCategoryService {
    constructor(private readonly  accountCategoryRepository: AccountCategoryRepository) {
    }

    async create(dto: AccountCategoryCreateDTO): Promise<void> {
        const isDuplicatedCode = await this.accountCategoryRepository.findOne({code: dto.code});

        if (isDuplicatedCode)
            throw new BadRequestException(['کد تکراری است']);

        let entity = new AccountCategoryEntity();

        entity.code = dto.code;
        entity.title = dto.title;

        await this.accountCategoryRepository.save(entity);
    }

    async update(dto: AccountCategoryUpdateDTO): Promise<void> {
        const entity = await this.accountCategoryRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        const isDuplicatedCode = await this.accountCategoryRepository.findOne({code: dto.code, id: Not(dto.id)});

        if (isDuplicatedCode)
            throw new BadRequestException(['کد تکراری است']);

        entity.code = dto.code;
        entity.title = dto.title;

        await this.accountCategoryRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        let entity = await this.accountCategoryRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        /*TODO let generalLedgerAccounts = this.generalLedgerAccountRepository.findByCategory(category.key);

        if (generalLedgerAccounts && generalLedgerAccounts.length > 0)
            throw new ValidationException(['گروه وارد شده دارای حساب کل است ، امکان حذف وجود ندارد']);*/

        await this.accountCategoryRepository.remove(entity);
    }
}