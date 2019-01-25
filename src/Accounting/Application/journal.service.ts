import { Injectable } from "../../Infrastructure/DependencyInjection";
import { JournalRepository } from "../Domain/journal.repository";
import { JournalCreateDTO, JournalMergeDTO, JournalUpdateDTO } from "./journal.DTO";
import { Journal, JournalStatus } from "../Domain/Journal.entity";
import { JournalLine } from "../Domain/journalLine.entity";
import { In } from "typeorm";
import { JournalFactory } from "../Domain/journal.factory";
import { getCurrentContext, getUnitOfWork, Transactional } from "../../Infrastructure/ApplicationCycle";
import { SubsidiaryLedgerAccountRepository } from "../Domain/subsidiaryLedgerAccount.repository";
import { DetailAccountRepository } from "../Domain/detailAccount.repository";
import { BadRequestException, NotFoundException } from "../../Infrastructure/Exceptions";
import { Enumerable } from "../../Infrastructure/Utility";
import { FiscalPeriodRepository } from "../../FiscalPeriod/fiscalPeriod.repository";
import { Context } from "../../Infrastructure/ExpressFramework/Types";
import { DimensionRepository } from "../Domain/dimension.repository";

@Injectable()
export class JournalService {
    private readonly currentContext: Context = getCurrentContext();

    constructor(private readonly journalRepository: JournalRepository,
                private readonly journalFactory: JournalFactory,
                private readonly subsidiaryLedgerAccountRepository: SubsidiaryLedgerAccountRepository,
                private readonly fiscalPeriodRepository: FiscalPeriodRepository,
                private readonly detailAccountRepository: DetailAccountRepository,
                private readonly dimensionRepository: DimensionRepository) { }

    async create(dto: JournalCreateDTO): Promise<string> {

        let entity = await this.journalFactory.fromDTO(dto);

        let errors = this.validate(entity);

        if (errors.length > 0)
            throw new BadRequestException(errors);

        if (entity.fiscalPeriod.isClosed)
            throw new BadRequestException([ 'دوره مالی بسته شده ، امکان ایجاد سند وجود ندارد' ]);

        await this.journalRepository.save(entity);

        return entity.id;
    }

    async update(dto: JournalUpdateDTO): Promise<void> {
        let entity = await this.journalRepository.findById(dto.id);

        entity.number = dto.number;
        entity.date = dto.date;
        entity.attachmentFileName = dto.attachmentFileName;
        entity.description = dto.description;
        entity.isInComplete = false;

        const promiseJournalLines = dto.journalLines.map(async line => {
            let journalLine = new JournalLine();
            journalLine.id = line.id;
            journalLine.subsidiaryLedgerAccount = await this.subsidiaryLedgerAccountRepository.findById(line.subsidiaryLedgerAccountId);
            journalLine.generalLedgerAccount = journalLine.subsidiaryLedgerAccount.generalLedgerAccount;
            journalLine.detailAccount = line.detailAccountId
                ? await this.detailAccountRepository.findById(line.detailAccountId)
                : undefined;
            journalLine.dimension1 = line.dimension1Id
                ? await this.dimensionRepository.findById(line.dimension1Id)
                : undefined;
            journalLine.dimension2 = line.dimension2Id
                ? await this.dimensionRepository.findById(line.dimension2Id)
                : undefined;
            journalLine.dimension3 = line.dimension3Id
                ? await this.dimensionRepository.findById(line.dimension3Id)
                : undefined;
            journalLine.article = line.article;
            journalLine.debtor = line.debtor;
            journalLine.creditor = line.creditor;

            return journalLine;
        });

        entity.journalLines = await Promise.all(promiseJournalLines);

        let errors = this.validate(entity);

        if (errors.length > 0)
            throw new BadRequestException(errors);

        await this.journalRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        if (!id)
            throw new NotFoundException();

        let entity = await this.journalRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const errors: string[] = await this.validateForRemove(entity);

        if (errors.length > 0)
            throw new BadRequestException(errors);

        await this.journalRepository.remove(entity);
    }

    async changeDate(id: string, date: string): Promise<void> {
        let entity = await this.journalRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        if (entity.status === JournalStatus.FIXED)
            throw new BadRequestException([ 'سند قطعی شده ، امکان حذف وجود ندارد' ]);

        entity.date = date;

        await this.journalRepository.save(entity);
    }

    async clone(id: string): Promise<string> {
        let source = await this.journalRepository.findById(id);

        if (!source)
            throw new NotFoundException();


        let entity: Journal = {...source, ...{id: undefined}} as Journal;

        entity.journalLines.forEach(e => e.id = undefined);

        entity = await this.journalFactory.fromEntity(source);

        let errors: string[] = this.validate(entity);

        if (errors.length > 0)
            throw new BadRequestException(errors);

        await this.journalRepository.save(entity);

        return entity.id;
    }

    @Transactional()
    async merge(dto: JournalMergeDTO): Promise<string> {
        const journals: Journal[] = await this.journalRepository.find({id: In(dto.ids)});

        if (journals.length !== dto.ids.length)
            throw new BadRequestException([ 'سند های انتخاب شده معتبر نیست' ]);

        let errors: string[] = [];

        journals.forEach(async journal => {
            let validationResult: string[] = await this.validateForRemove(journal);
            errors = errors.concat(validationResult);
        });

        if (errors.length > 0)
            throw new BadRequestException(errors);

        let entity = new Journal();

        entity.description = dto.shouldConcatDescriptions
            ? journals.map(item => item.description || '').join(' ')
            : dto.description;

        entity.journalLines = Enumerable.from(journals)
            .selectMany(item => item.journalLines)
            .toArray();

        entity = await this.journalFactory.fromEntity(entity);

        await this.journalRepository.save(entity);
        journals.forEach(async journal => await this.journalRepository.remove(journal));

        await getUnitOfWork().commit();

        return entity.id;
    }

    async fix(id: string): Promise<void> {
        let entity = await this.journalRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        if (entity.status === JournalStatus.FIXED)
            throw new BadRequestException([ 'سند قبلا قطعی شده' ]);

        entity.status = JournalStatus.FIXED;

        await this.journalRepository.save(entity);
    }

    async attachImage(id: string, attachmentFileName: string): Promise<void> {
        if (!id)
            throw new NotFoundException();

        if (!attachmentFileName)
            throw new BadRequestException([ 'فایل ضمیمه وجود ندارد' ]);

        let entity = await this.journalRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        entity.attachmentFileName = attachmentFileName;

        await this.journalRepository.save(entity);
    }

    private validate(entity: Journal): string[] {
        let errors = [];

        const remainder = Enumerable.from(entity.journalLines).sum(item => item.debtor - item.creditor);
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

            if (!line.subsidiaryLedgerAccount)
                errors.push('حساب معین وجود ندارد');

            if (line.subsidiaryLedgerAccount.hasDetailAccount && !line.detailAccount)
                errors.push('حساب تفصیل وجود ندارد');

            if (line.subsidiaryLedgerAccount.hasDimension1 && !line.dimension1)
                errors.push('سطح چهارم مقدار ندارد یا معتبر نیست');

            if (line.subsidiaryLedgerAccount.hasDimension2 && !line.dimension2)
                errors.push('سطح پنجم مقدار ندارد یا معتبر نیست');

            if (line.subsidiaryLedgerAccount.hasDimension3 && !line.dimension3)
                errors.push('سطح ششم مقدار ندارد یا معتبر نیست');
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

        const currentFiscalPeriod = await this.fiscalPeriodRepository.findById(this.currentContext.fiscalPeriodId);
        if (currentFiscalPeriod.isClosed)
            errors.push('دوره مالی بسته شده ، امکان حذف وجود ندارد');

        /*
        if (this.invoiceRepository.isExitsJournal(journal.id))
            errors.push('این سند برای فاکتور صادر شده ، امکان حذف وجود ندارد');

        if (this.invoiceRepository.isExitsJournal(journal.id))
            errors.push('این سند برای اسناد انباری صادر شده ، امکان حذف وجود ندارد');

        if (this.treasuryRepository.isExitsJournal(journal.id))
            errors.push('این سند برای اسناد خزانه داری صادر شده ، امکان حذف وجود ندارد');*/

        return errors;
    }
}