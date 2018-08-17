import {BanksNameRepository} from "./BanksNameRepository";
import {BanksNameService} from "./BanksNameService";
import {BanksNameQuery} from "./BanksNameQuery";
import {PayableChequeCategoryRepository} from "./PayableChequeCategoryRepository";
import {PayableChequeCategoryQuery} from "./PayableChequeCategoryQuery";
import {PayableChequeCategoryService} from "./PayableChequeCategoryService";
import {PayableChequeService} from "./PayableChequeService";
import {ChequeEventListener} from "./ChequeEventListener";

import {TreasuryCashService} from "./TreasuryCashService";
import {TreasuryChequeService} from "./TreasuryChequeService";
import {TreasuryDemandNoteService} from "./TreasuryDemandNoteService";
import {TreasuryJournalGenerationService} from "./TreasuryJournalGenerationService";
import {TreasuryPaymentQuery} from "./TreasuryPaymentQuery";
import {TreasuryPurposeQuery} from "./TreasuryPurposeQuery";
import {TreasuryPurposeRepository} from "./TreasuryPurposeRepository";
import {TreasuryPurposeService} from "./TreasuryPurposeService";
import {TreasuryReceiptService} from "./TreasuryReceiptService";
import {TreasuryReceiveQuery} from "./TreasuryReceiveQuery";
import {TreasuryRepository} from "./TreasuryRepository";
import {TreasuryService} from "./TreasuryService";
import {TreasurySettingRepository} from "./TreasurySettingRepository";
import {TreasurySettingsService} from "./TreasurySettingService";
import {TreasurySettingsQuery} from "./TreasurySettingsQuery";
import {TreasuryTransferService} from "./TreasuryTransferService";
import {TreasuryTransferQuery} from "./TreasuryTransferQuery";

import "./BanksNameController";
import "./PayableChequeCategoryController";
import "./TreasuryPaymentController";
import "./TreasuryReceiveController";
import "./TreasurySettingsController";
import "./TreasuryTransferController";

export function register(container) {

    container.bind("BanksNameRepository").to(BanksNameRepository);
    container.bind("BanksNameService").to(BanksNameService);
    container.bind("BanksNameQuery").to(BanksNameQuery);

    container.bind("PayableChequeCategoryRepository").to(PayableChequeCategoryRepository);
    container.bind("PayableChequeCategoryQuery").to(PayableChequeCategoryQuery);
    container.bind("PayableChequeCategoryService").to(PayableChequeCategoryService);
    container.bind("PayableChequeService").to(PayableChequeService);
    container.bind("ChequeEventListener").to(ChequeEventListener);

    container.bind("TreasuryCashService").to(TreasuryCashService);
    container.bind("TreasuryChequeService").to(TreasuryChequeService);
    container.bind("TreasuryDemandNoteService").to(TreasuryDemandNoteService);
    container.bind("TreasuryJournalGenerationService").to(TreasuryJournalGenerationService);
    container.bind("TreasuryPaymentQuery").to(TreasuryPaymentQuery);
    container.bind("TreasuryPurposeQuery").to(TreasuryPurposeQuery);
    container.bind("TreasuryReceiveQuery").to(TreasuryReceiveQuery);
    container.bind("TreasuryPurposeRepository").to(TreasuryPurposeRepository);
    container.bind("TreasuryPurposeService").to(TreasuryPurposeService);
    container.bind("TreasuryReceiptService").to(TreasuryReceiptService);
    container.bind("TreasuryRepository").to(TreasuryRepository);
    container.bind("TreasuryService").to(TreasuryService);
    container.bind("TreasurySettingsService").to(TreasurySettingsService);
    container.bind("TreasurySettingsQuery").to(TreasurySettingsQuery);
    container.bind("TreasuryTransferService").to(TreasuryTransferService);
    container.bind("TreasuryTransferQuery").to(TreasuryTransferQuery);
    container.bind("TreasurySettingRepository").to(TreasurySettingRepository);
}
