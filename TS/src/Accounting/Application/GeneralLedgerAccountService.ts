import {Inject, Injectable} from "../../Infrastructure/DependencyInjection";
import {GeneralLedgerAccountCreateDTO, GeneralLedgerAccountUpdateDTO} from "./GeneralLedgerAccountDTO";
import {GeneralLedgerAccountRepository} from "../Domain/GeneralLedgerAccountRepository";
import {Validate} from "../../Infrastructure/Validator/Validate";
import {GeneralLedgerAccount} from "../Domain/GeneralLedgerAccount";
import {Not} from "typeorm";

@Injectable()
export class GeneralLedgerAccountService {
    @Inject('GeneralLedgerAccountRepository') generalLedgerAccountRepository: GeneralLedgerAccountRepository;

    @Validate(GeneralLedgerAccountCreateDTO)
    async create(dto: GeneralLedgerAccountCreateDTO): Promise<string> {
        const isDuplicatedCode = await this.generalLedgerAccountRepository.findOne({code: dto.code});

        if (isDuplicatedCode)
            throw new ValidationException(['کد تکراری است']);

        let entity = new GeneralLedgerAccount();
        entity.code = dto.code;
        entity.title = dto.title;
        entity.groupingType = dto.groupingType;
        entity.postingType = dto.postingType;

        await this.generalLedgerAccountRepository.save(entity);

        return entity.id;
    }

    @Validate(GeneralLedgerAccountUpdateDTO)
    async update(dto: GeneralLedgerAccountUpdateDTO): Promise<void> {
        const entity = await this.generalLedgerAccountRepository.findById(dto.id);

        if(!entity)
            throw new NotFoundException();

        const isDuplicatedCode = await this.generalLedgerAccountRepository.findOne({code: dto.code, id: Not(dto.id)});

        if (isDuplicatedCode)
            throw new ValidationException(['کد تکراری است']);

        entity.code = dto.code;
        entity.title = dto.title;
        entity.groupingType = dto.groupingType;
        entity.postingType = dto.postingType;

        await this.generalLedgerAccountRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        const entity = await this.generalLedgerAccountRepository.findById(id);

        if(!entity)
            throw new NotFoundException();

        /*TODO if (generalLedgerAccount.subsidiaryLedgerAccounts && generalLedgerAccount.subsidiaryLedgerAccounts.length > 0)
            errors.push('حساب کل جاری دارای معین میباشد ، امکان حذف وجود ندارد');*/

        await this.generalLedgerAccountRepository.remove(entity);
    }
}