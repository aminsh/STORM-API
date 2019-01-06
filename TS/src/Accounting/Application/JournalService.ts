import {Inject, Injectable} from "../../Infrastructure/DependencyInjection";
import {ITransactionalEntity, JournalRepository} from "../Domain/JournalRepository";
import {JournalCreateDTO, JournalMergeDTO, JournalUpdateDTO} from "./JournalDTO";
import {Journal, JournalStatus} from "../Domain/Journal";
import {JournalLine} from "../Domain/JournalLine";
import {EntityState} from "../../Infrastructure/EntityState";
import {Validate} from "../../Infrastructure/Validator/Validate";
import {In} from "typeorm";
import {JournalFactory} from "../Domain/JournalFactory";

@Injectable()
export class JournalService {

    @Inject("JournalRepository") private journalRepository: JournalRepository;
    @Inject("State") private state: State;
    @Inject("JournalFactory") journalFactory: JournalFactory;

    @Validate(JournalCreateDTO)
    async create(dto: JournalCreateDTO): Promise<string> {

        let entity = await this.journalFactory.fromDTO(dto);

        let errors = this.validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        await this.journalRepository.save(entity, EntityState.CREATED);

        return entity.id;
    }

    @Validate(JournalCreateDTO)
    async update(dto: JournalUpdateDTO): Promise<void> {
        let entity = await this.journalRepository.findById(dto.id);

        entity.number = dto.number;
        entity.date = dto.date;
        entity.attachmentFileName = dto.attachmentFileName;
        entity.description = dto.description;
        entity.fiscalPeriod = this.state.fiscalPeriodId;
        entity.isInComplete = false;
        entity.journalLines = dto.journalLines.map(line => {
            let journalLine = new JournalLine();
            journalLine.id = line.id;
            journalLine.article = line.article;
            journalLine.debtor = line.debtor;
            journalLine.creditor = line.creditor;
            return journalLine;
        });

        let errors = this.validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        await this.journalRepository.save(entity, EntityState.MODIFIED);
    }

    async remove(id: string): Promise<void> {
        let entity = await this.journalRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const errors: string[] = await this.validateForRemove(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        await this.journalRepository.remove(entity);
    }

    async changeDate(id: string, date: string): Promise<void> {
        let entity = await this.journalRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        if (entity.status === JournalStatus.FIXED)
            throw new ValidationException(['سند قطعی شده ، امکان حذف وجود ندارد']);

        entity.date = date;

        await this.journalRepository.save(entity, EntityState.MODIFIED);
    }

    async clone(id: string): Promise<string> {
        let source = await this.journalRepository.findById(id);

        if (!source)
            throw new NotFoundException();


        let entity: Journal = {id: undefined, ...source};

        entity.journalLines.forEach(e => e.id = undefined);

        entity = await this.journalFactory.fromEntity(source);

        let errors: string[] = this.validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        await this.journalRepository.save(entity, EntityState.CREATED);

        return entity.id;
    }

    @Validate(JournalMergeDTO)
    async merge(dto: JournalMergeDTO): Promise<string> {

        const journals: Journal[] = await this.journalRepository.find({id: In(dto.ids)});

        let errors: string[] = [];

        journals.forEach(async journal => {
            let validationResult: string[] = await this.validateForRemove(journal);
            errors = errors.concat(validationResult);
        });

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = new Journal();

        entity.description = dto.shouldConcatDescriptions
            ? journals.map(item => item.description || '').join(' ')
            : dto.description;

        entity.journalLines = journals
            .asEnumerable()
            .selectMany(item => item.journalLines)
            .toArray();

        entity = await this.journalFactory.fromEntity(entity);

        let entities: ITransactionalEntity[] = [{entity, state: EntityState.CREATED}]
            .concat(journals.map(j => ({entity: j, state: EntityState.REMOVED})));

        await this.journalRepository.transactionalSave(entities);

        return entity.id;
    }

    async fix(id: string): Promise<void> {
        let entity = await this.journalRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        if (entity.status === JournalStatus.FIXED)
            throw new ValidationException(['سند قبلا قطعی شده']);

        entity.status = JournalStatus.FIXED;

        await this.journalRepository.save(entity, EntityState.MODIFIED);
    }

    async attachImage(id: string, attachmentFileName: string): Promise<void> {
        let entity = await this.journalRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        entity.attachmentFileName = attachmentFileName;

        await this.journalRepository.save(entity, EntityState.MODIFIED);
    }

    private validate(entity: Journal): string[] {
        let errors = [];

        const remainder = entity.journalLines.asEnumerable().sum(item => item.debtor - item.creditor);
        if (remainder !== 0)
            errors.push('جمع بدهکار و بستانکار سند برابر نیست');

        errors = entity.journalLines
            .map(this.validateLine.bind(this))
            .concat(errors);

        return errors;

    }

    private validateLine(line: JournalLine): string[] {

        let errors: string[] = [];

        if (!line.subsidiaryLedgerAccount)
            errors.push('حساب معین مقدار ندارد یا صحیح نیست');
        else {
            /*let subsidiaryLedgerAccount = this.subsidiaryLedgerAccountRepository
                    .findById(line.subsidiaryLedgerAccountId),

                detailAccount = Utility.String.isNullOrEmpty(line.detailAccountId)
                    ? null
                    : this.detailAccountRepository.findById(line.detailAccountId);

            if (!detailAccount && subsidiaryLedgerAccount.hasDetailAccount)
                errors.push('تفصیل مقدار ندارد یا معتبر نیست');

            let dimension1 = Utility.String.isNullOrEmpty(line.dimension1Id)
                ? null
                : this.detailAccountRepository.findById(line.dimension1Id);

            if (!dimension1 && subsidiaryLedgerAccount.hasDimension1)
                errors.push('سطح چهارم مقدار ندارد یا معتبر نیست');

            let dimension2 = Utility.String.isNullOrEmpty(line.dimension2Id)
                ? null
                : this.detailAccountRepository.findById(line.dimension2Id);

            if (!dimension2 && subsidiaryLedgerAccount.hasDimension2)
                errors.push('سطح پنجم مقدار ندارد یا معتبر نیست');

            let dimension3 = Utility.String.isNullOrEmpty(line.dimension3Id)
                ? null
                : this.detailAccountRepository.findById(line.dimension3Id);

            if (!dimension3 && subsidiaryLedgerAccount.hasDimension3)
                errors.push('سطح ششم مقدار ندارد یا معتبر نیست');*/
        }

        if (line.debtor === 0 && line.creditor === 0)
            errors.push('بدهکار یا بستانکار باید دارای مقدار باشد');

        if (line.creditor !== 0 && line.creditor !== 0)
            errors.push('بدهکار و بستانکار نمیتواند هر دو دارای مقدار باشد');

        return errors;
    }

    private async validateForRemove(entity: Journal): Promise<string[]> {
        let errors: string[] = [];

        if (entity.status === JournalStatus.FIXED)
            errors.push('سند قطعی شده ، امکان حذف وجود ندارد');

        /*if (this.fiscalPeriodRepository.findById(this.state.fiscalPeriodId).isClosed)
            errors.push('دوره مالی بسته شده ، امکان حذف وجود ندارد');

        if (this.invoiceRepository.isExitsJournal(journal.id))
            errors.push('این سند برای فاکتور صادر شده ، امکان حذف وجود ندارد');

        if (this.invoiceRepository.isExitsJournal(journal.id))
            errors.push('این سند برای اسناد انباری صادر شده ، امکان حذف وجود ندارد');

        if (this.treasuryRepository.isExitsJournal(journal.id))
            errors.push('این سند برای اسناد خزانه داری صادر شده ، امکان حذف وجود ندارد');*/

        return errors;
    }
}