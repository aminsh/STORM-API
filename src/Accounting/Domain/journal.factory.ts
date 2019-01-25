import { Injectable } from "../../Infrastructure/DependencyInjection";
import { JournalCreateDTO } from "../Application/journal.DTO";
import { Journal, JournalStatus } from "./Journal.entity";
import { JournalLine } from "./journalLine.entity";
import { JournalRepository } from "./journal.repository";
import { getCurrentContext } from "../../Infrastructure/ApplicationCycle";
import { SubsidiaryLedgerAccountRepository } from "./subsidiaryLedgerAccount.repository";
import { DetailAccountRepository } from "./detailAccount.repository";
import { FiscalPeriodRepository } from "../../FiscalPeriod/fiscalPeriod.repository";
import { PersianDate } from "../../Infrastructure/Utility";
import { DimensionRepository } from "./dimension.repository";

@Injectable()
export class JournalFactory {
    constructor(private readonly journalRepository: JournalRepository,
        private readonly fiscalPeriodRepository: FiscalPeriodRepository,
        private readonly subsidiaryLedgerAccountRepository: SubsidiaryLedgerAccountRepository,
        private readonly detailAccountRepository: DetailAccountRepository,
        private readonly dimensionRepository: DimensionRepository) { }

    async fromDTO(dto: JournalCreateDTO): Promise<Journal> {

        let entity = new Journal();

        entity.number = dto.number;
        entity.date = dto.date || PersianDate.current();
        entity.attachmentFileName = dto.attachmentFileName;
        entity.description = dto.description;
        entity.fiscalPeriod = await this.fiscalPeriodRepository.findById(getCurrentContext().fiscalPeriodId);
        entity.isInComplete = false;
        entity.status = JournalStatus.TEMPORARY;

        const promiseJournalLines = dto.journalLines.map(async line => {
            let journalLine = new JournalLine();
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

        return this.fromEntity(entity);
    }

    async fromEntity(entity: Journal): Promise<Journal> {
        entity.number = await this.journalRepository.findMaxNumber();
        return entity;
    }
}