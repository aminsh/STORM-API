import {Injectable} from "../../Infrastructure/DependencyInjection";
import {GeneralLedgerAccountCreateDTO, GeneralLedgerAccountUpdateDTO} from "./generalLedgerAccount.DTO";
import {GeneralLedgerAccountRepository} from "../Domain/generalLedgerAccount.repository";
import {GeneralLedgerAccount} from "../Domain/generalLedgerAccount.entity";
import {Not} from "typeorm";
import {BadRequestException, NotFoundException} from "../../Infrastructure/Exceptions";

@Injectable()
export class GeneralLedgerAccountService {
    constructor(private readonly generalLedgerAccountRepository: GeneralLedgerAccountRepository) {
    }

    async create(dto: GeneralLedgerAccountCreateDTO): Promise<string> {
        const isDuplicatedCode = await this.generalLedgerAccountRepository.findOne({code: dto.code});

        if (isDuplicatedCode)
            throw new BadRequestException(['کد تکراری است']);

        let entity = new GeneralLedgerAccount();
        entity.code = dto.code;
        entity.title = dto.title;
        entity.groupingType = dto.groupingType;
        entity.postingType = dto.postingType;

        await this.generalLedgerAccountRepository.save(entity);

        return entity.id;
    }

    async update(dto: GeneralLedgerAccountUpdateDTO): Promise<void> {
        const entity = await this.generalLedgerAccountRepository.findById(dto.id);

        if (!entity)
            throw new NotFoundException();

        const isDuplicatedCode = await this.generalLedgerAccountRepository.findOne({code: dto.code, id: Not(dto.id)});

        if (isDuplicatedCode)
            throw new BadRequestException(['کد تکراری است']);

        entity.code = dto.code;
        entity.title = dto.title;
        entity.groupingType = dto.groupingType;
        entity.postingType = dto.postingType;

        await this.generalLedgerAccountRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        const entity = await this.generalLedgerAccountRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const subsidiaryLedgerAccounts = await entity.subsidiaryLedgerAccounts;

        if (subsidiaryLedgerAccounts.length > 0)
            throw new BadRequestException(['حساب کل جاری دارای معین میباشد ، امکان حذف وجود ندارد']);

        await this.generalLedgerAccountRepository.remove(entity);
    }
}