import {Inject, Injectable} from "../../Infrastructure/DependencyInjection";
import {JournalCreateDTO} from "../Application/JournalDTO";
import {Journal, JournalStatus} from "./Journal";
import {JournalLine} from "./JournalLine";
import {JournalRepository} from "./JournalRepository";

@Injectable()
export class JournalFactory {

    @Inject("JournalRepository") private journalRepository: JournalRepository;
    @Inject("State") private state: State;

    async fromDTO(dto: JournalCreateDTO): Promise<Journal> {

        let entity = new Journal();

        entity.number = dto.number;
        entity.date = dto.date || Utility.PersianDate.current();
        entity.attachmentFileName = dto.attachmentFileName;
        entity.description = dto.description;
        entity.fiscalPeriod = this.state.fiscalPeriodId;
        entity.isInComplete = false;
        entity.status = JournalStatus.TEMPORARY;
        entity.journalLines = dto.journalLines.map(line => {
            let journalLine = new JournalLine();
            journalLine.article = line.article;
            journalLine.debtor = line.debtor;
            journalLine.creditor = line.creditor;
            return journalLine;
        });

        return this.fromEntity(entity);
    }

    async fromEntity(entity: Journal): Promise<Journal> {

        entity.number = await this.journalRepository.findMaxNumber();

        return entity;
    }
}