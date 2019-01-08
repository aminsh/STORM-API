import {Inject, Injectable} from "../../Infrastructure/DependencyInjection";
import {AccountCategoryCreateDTO, AccountCategoryUpdateDTO} from "./AccountCategoryDTO";
import {AccountCategoryRepository} from "../Domain/AccountCategoryRepository";
import {AccountCategory} from "../Domain/AccountCategory";
import {Not} from "typeorm";
import {Validate} from "../../Infrastructure/Validator/Validate";

@Injectable()
export class AccountCategoryService {
    @Inject('AccountCategoryRepository') accountCategoryRepository: AccountCategoryRepository;

    @Validate(AccountCategoryCreateDTO)
    async create(dto: AccountCategoryCreateDTO): Promise<void> {
        const isDuplicatedCode = await this.accountCategoryRepository.findOne({code: dto.code});

        if (isDuplicatedCode)
            throw new ValidationException(['کد تکراری است']);

        let entity = new AccountCategory();

        entity.code = dto.code;
        entity.title = dto.title;

        await this.accountCategoryRepository.save(entity);
    }

    @Validate(AccountCategoryUpdateDTO)
    async update(dto: AccountCategoryUpdateDTO): Promise<void> {
        const entity = await this.accountCategoryRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        const isDuplicatedCode = await this.accountCategoryRepository.findOne({code: dto.code, id: Not(dto.id)});

        if (isDuplicatedCode)
            throw new ValidationException(['کد تکراری است']);

        entity.code = dto.code;
        entity.title = dto.title;

        await this.accountCategoryRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        let entity = await this.accountCategoryRepository.findById(id);

        if(!entity)
            throw new NotFoundException();

        /*TODO let generalLedgerAccounts = this.generalLedgerAccountRepository.findByCategory(category.key);

        if (generalLedgerAccounts && generalLedgerAccounts.length > 0)
            throw new ValidationException(['گروه وارد شده دارای حساب کل است ، امکان حذف وجود ندارد']);*/

        await this.accountCategoryRepository.remove(entity);
    }
}