import {inject, injectable} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class TreasuryChequeDomainService {
    /** @type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    /** @type {JournalDomainService}*/
    @inject("JournalDomainService") journalDomainService = undefined;

    mapToEntity(cmd) {
        return {
            id: cmd.id,
            transferDate: cmd.transferDate || PersianDate.current(),
            sourceDetailAccountId: cmd.payerId || cmd.sourceDetailAccountId || null,
            destinationDetailAccountId: cmd.receiverId || cmd.destinationDetailAccountId || null,
            amount: cmd.amount,
            imageUrl: JSON.stringify(cmd.imageUrl || []),
            description: cmd.description,
            treasuryType: cmd.treasuryType,
            documentType: cmd.documentType,
            journalId: cmd.journalId,
            isCompleted: cmd.isCompleted,
            receiveId: cmd.receiveId,
            documentDetailId: cmd.documentDetailId,
            documentDetail: this._documentDetailMapToEntity(cmd.documentDetail)
        }
    }

    _documentDetailMapToEntity(documentDetail) {

        if (!documentDetail)
            return null;

        return {
            id: documentDetail.id,
            transferTo: documentDetail.transferTo,
            transferFrom: documentDetail.transferFrom,
            number: documentDetail.number,
            dueDate: documentDetail.dueDate,
            bank: documentDetail.bank,
            bankBranch: documentDetail.bankBranch,
            payTo: documentDetail.payTo,
            chequeAccountNumber: documentDetail.chequeAccountNumber,
            canTransferToAnother: documentDetail.canTransferToAnother,
            status: documentDetail.status,
            chequeStatusHistory: JSON.stringify(documentDetail.chequeStatusHistory || []),
            trackingNumber: documentDetail.trackingNumber
        }
    }

    _receiveValidate(entity) {

        let errors = [],
            sourceDetailAccount = this.detailAccountRepository.findById(entity.sourceDetailAccountId);


        if (!sourceDetailAccount)
            errors.push('پرداخت کننده چک دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ چک معتبر نیست.');

        if (Utility.String.isNullOrEmpty(entity.sourceDetailAccountId))
            errors.push('پرداخت کننده چک خالی می باشد.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.documentDetail.dueDate))
            errors.push('تاریخ سررسید نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.documentDetail.number))
            errors.push('شماره چک نباید خالی باشد');

        return errors;
    }

    _paymentValidate(entity) {

        let errors = [],
            destinationDetailAccount = this.detailAccountRepository.findById(entity.destinationDetailAccountId)

        if (!destinationDetailAccount)
            errors.push('دریافت کننده چک دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ چک معتبر نیست.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.documentDetail.dueDate))
            errors.push('تاریخ سررسید نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.documentDetail.number.toString()))
            errors.push('شماره چک نباید خالی باشد');

        return errors;
    }

    _changeStatusValidate(entity) {
        let errors = [],
            paymentCheque = this.treasuryRepository.isSpendCheque(entity.id);

        if (entity.isCompleted && entity.documentDetail.status === 'passed')
            errors.push('چک قبلا پاس شده است!');

        if (paymentCheque && entity.treasuryType === 'receive'
                && entity.documentDetail.status === 'spend')
            errors.push('امکان تغییر وضعیت چک خرج شده وجود ندارد!');

        return errors;
    }

    createReceive(cmd) {
        let entity = this.mapToEntity(cmd),
            errors = this._receiveValidate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'receive';
        entity.documentType = 'cheque';
        entity.documentDetail.canTransferToAnother = entity.documentDetail.canTransferToAnother || false;

        entity = this.treasuryRepository.create(entity);

        //this.eventBus.send('onChequeCreated', entity.id);
        return entity.id;
    }

    createPayment(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._paymentValidate(entity),
            cheque = this.treasuryRepository.findByNumber(entity.documentDetail.number);

        if (cheque
            && cheque.sourceDetailAccountId === entity.sourceDetailAccountId
            && cheque.treasuryType === entity.treasuryType)
            errors.push('شماره چک تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'payment';
        entity.documentType = entity.documentType || 'cheque';
        entity.documentDetail.canTransferToAnother = entity.documentDetail.canTransferToAnother || false;

        entity = this.treasuryRepository.create(entity);

        if (entity.documentType !== 'spendCheque')
            this.eventBus.send('onChequeCreated', entity.id);

        return entity.id;
    }

    create(cmd){
        if (cmd.treasuryType === 'receive')
            return this.createReceive(cmd);

        if (cmd.treasuryType === 'payment')
            return this.createPayment(cmd);
    }

    update(id, cmd) {
        let entity = this.mapToEntity(cmd),
            persistedTreasury = this.treasuryRepository.findById(id),
            errors = persistedTreasury.treasuryType === 'receive' ? this._receiveValidate(entity)
                : this._paymentValidate(entity);

        if (persistedTreasury.journalId)
            errors.push('برای چک سند صادر شده است و امکان ویرایش چک وجود ندارد!');


        if (persistedTreasury.treasuryType === 'receive' && entity.documentDetail.status === 'spend')
            errors.push('امکان تغییر چک خرج شده وجود ندارد!');

        //journalService = this.journalDomainService,
        //treasuryJournalGeneration = this.treasuryJournalGenerationDomainService,

        /*journals = persistedTreasury.documentDetail.chequeStatusHistory
            ? persistedTreasury.documentDetail.chequeStatusHistory.asEnumerable()
                .where(e => e.journalId)
                .select(item => ({
                    journalId: item.journalId,
                    status: item.status
                }))
                .toArray()
            : persistedTreasury.journalId ? [persistedTreasury.journalId] : null;*/

        if (!persistedTreasury)
            errors.push('{0} وجود ندارد!'.format(Enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)));

        if (persistedTreasury.documentDetail.status === 'passed')
            errors.push('چک وصول شده قابل ویرایش نمی باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        //entity.journalId = null;
        this.treasuryRepository.update(id, entity);

        /*if (journals) {
            let journalIds = [];

            /!*journals.forEach(item => journalService.remove(item.journalId));
            journals.forEach(item => journalIds.push(treasuryJournalGeneration.generateForChequeWithStatus(id,item.status)));*!/

            journals.forEach(item => updateChequeJournals(id, entity));
            journalIds.forEach(item => this.setJournal(id, item));
        }*/

    }

    remove(id) {
        let persistedTreasury = this.treasuryRepository.findById(id),
            spendCheque = this.treasuryRepository.isSpendCheque(persistedTreasury.id),
            errors = [];
        /*    journalService = this.journalDomainService,

            journalIds = persistedTreasury.documentDetail.chequeStatusHistory
                ? persistedTreasury.documentDetail.chequeStatusHistory.asEnumerable()
                    .where(e => e.journalId)
                    .select(item => item.journalId)
                    .toArray()
                : persistedTreasury.journalId ? [persistedTreasury.journalId] : null;*/

        if (persistedTreasury.journalId)
            errors.push('برای چک سند صادر شده است و امکان حذف چک وجود ندارد!');

        if (spendCheque)
            errors.push('چک خرج شده است و قابل حذف نمی باشد!');


        if (errors.length > 0)
            throw new ValidationException(errors);

        this.treasuryRepository.remove(id);

        /*if (journalIds)
            journalIds.forEach(item => journalService.remove(item));*/
    }

    setJournal(id, journalId) {
        let persistedTreasury = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(persistedTreasury);

        if (entity.documentType === 'spendCheque')
            return this.setJournalForSpend(entity.receiveId, id, journalId);

        entity.journalId = journalId;
        entity.documentDetail.chequeStatusHistory =
            persistedTreasury.documentDetail.chequeStatusHistory.asEnumerable()
                .select(item => ({
                    createdAt: item.createdAt,
                    status: item.status,
                    journalId: item.journalId ? item.journalId :
                        item.status === persistedTreasury.documentDetail.status
                            ? journalId : null
                }))
                .toArray();

        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        return this.treasuryRepository.update(id, entity);
    }

    chequeInFund(id, cmd) {
        let cheque = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(cheque),
            errors = this._changeStatusValidate(entity);

        if (entity.documentDetail.status === 'inFund')
            errors.push('چک با وضعیت نزد صندوق ثبت شده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.isCompleted = false;
        entity.documentDetail.status = 'inFund';

        entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            status: 'inFund',
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(entity.id, entity);

        this.eventBus.send('onChequeStatusChanged', id);

        return entity.id;
    }

    receiveChequePass(id, cmd) {
        let cheque = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(cheque),
            errors = this._changeStatusValidate(entity);

        if (entity.documentDetail.status === 'passed')
            errors.push('چک با وضعیت پاس شده ثبت شده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.destinationDetailAccountId = cmd.receiverId;
        entity.documentDetail.status = 'passed';
        entity.isCompleted = true;

        entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'passed',
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            passedDate: cmd.date,
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(entity.id, entity);

        this.eventBus.send('onChequeStatusChanged', id);

        return entity.id;
    }

    paymentChequePass(id, cmd) {
        let cheque = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(cheque),
            errors = this._changeStatusValidate(entity);

        if (entity.documentDetail.status === 'passed')
            errors.push('چک با وضعیت پاس شده ثبت شده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.documentDetail.status = 'passed';
        entity.isCompleted = true;

        entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'passed',
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            passedDate: cmd.date,
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(entity.id, entity);

        this.eventBus.send('onChequeStatusChanged', id);

        return entity.id;
    }

    chequeInProcess(id, cmd) {
        let cheque = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(cheque),
            errors = this._changeStatusValidate(entity);

        if (entity.documentDetail.status === 'inProcessOnPassing')
            errors.push('چک با وضعیت در جریان وصول ثبت شده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.isCompleted = false;
        entity.documentDetail.status = 'inProcessOnPassing';

        entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            status: 'inProcessOnPassing',
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(entity.id, entity);

        this.eventBus.send('onChequeStatusChanged', id);

        return entity.id;
    }

    chequeReturn(id, cmd) {
        let cheque = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(cheque),
            errors = this._changeStatusValidate(entity);

        if (entity.documentDetail.status === 'return')
            errors.push('چک با وضعیت برگشتی ثبت شده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.isCompleted = true;
        entity.documentDetail.status = 'return';
        entity.documentDetail.trackingNumber = cmd.identity || null;
        entity.documentDetail.transferTo = cmd.transferTo || null;

        entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'return',
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(entity.id, entity);

        this.eventBus.send('onChequeStatusChanged', id);

        return entity.id;
    }

    spentChequeReturn(id, cmd) {
        let cheque = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(cheque),
            errors = [];



        if (entity.documentDetail.status === 'return')
            errors.push('چک با وضعیت برگشتی ثبت شده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.isCompleted = true;
        entity.documentDetail.status = 'return';
        entity.documentDetail.trackingNumber = cmd.identity || null;
        entity.documentDetail.transferTo = cmd.transferTo || null;

        entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'return',
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(entity.id, entity);
        this.eventBus.send('onChequeStatusChanged', id);

        if (cheque.receiveId){
            let receiveCheque = this.treasuryRepository.findById(cheque.receiveId);
            this.spentChequeReturn(receiveCheque.id, cmd);
        }

        return entity.id;
    }

    chequeRevocation(id, cmd) {
        let cheque = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(cheque),
            errors = this._changeStatusValidate(entity);

        if (entity.documentDetail.status === 'revocation')
            errors.push('چک با وضعیت ابطالی ثبت شده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.isCompleted = true;
        entity.documentDetail.status = 'revocation';

        entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'revocation',
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(entity.id, entity);

        this.eventBus.send('onChequeStatusChanged', id);

        return entity.id;
    }

    chequeMissing(id, cmd) {
        let cheque = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(cheque),
            errors = this._changeStatusValidate(entity);

        if (entity.documentDetail.status === 'missing')
            errors.push('چک با وضعیت مفقودی/ سرقتی ثبت شده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.isCompleted = false;
        entity.documentDetail.status = 'missing';

        entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'missing',
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(entity.id, entity);

        this.eventBus.send('onChequeStatusChanged', id);

        return entity.id;
    }

    chequeSpend(cmd) {
        let receiveCheque = cmd.receiveId ? this.treasuryRepository.findById(cmd.receiveId) : null,
            receiver = this.detailAccountRepository.findById(cmd.receiverId),
            entity = this.mapToEntity(receiveCheque),
            errors = this._changeStatusValidate(entity);

        if (receiveCheque.documentDetail.status === 'spend')
            errors.push('چک با وضعیت خرج/ انتقالی ثبت شده است!');

        if (receiver.detailAccountType !== 'person')
            errors.push('دریافت کننده چک باید شخص باشد.');

        if (receiveCheque.documentDetail.status === 'passed')
            errors.push('چک پاس شده نمی تواند خرج شود!');

        if (errors.length > 0)
            throw new ValidationException(errors);


        if (receiveCheque) {

            entity.isCompleted = true;
            entity.documentDetail.status = 'spend';
            entity.destinationDetailAccountId = cmd.receiverId;
            entity.documentDetail.chequeStatusHistory = receiveCheque.documentDetail.chequeStatusHistory || [];
            entity.documentDetail.chequeStatusHistory.push({
                createdAt: new Date(),
                status: 'spend',
                order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                    entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
                journalId: null
            });
            entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

            this.treasuryRepository.update(entity.id, entity);
        }


        entity.documentType = 'spendCheque';
        entity.treasuryType = 'payment';
        entity.journalId = null;
        entity.receiveId = receiveCheque.id;
        entity.imageUrl = receiveCheque.imageUrl.length > 0 ? receiveCheque.imageUrl.push(cmd.imageUrl) : cmd.imageUrl;
        entity.documentDetail.transferTo = cmd.documentDetail.transferTo;
        entity.documentDetail.transferFrom = cmd.documentDetail.transferFrom;
        entity.description = cmd.description;
        delete entity.id;
        delete entity.documentDetail.id;
        delete entity.documentDetailId;

        entity.isCompleted = false;
        entity.documentDetail.status = 'spend';

        entity.documentDetail.chequeStatusHistory = [];
        entity.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'spend',
            order: entity.documentDetail.chequeStatusHistory.length === 0 ? 1 :
                entity.documentDetail.chequeStatusHistory.asEnumerable().max(item => item.order) + 1,
            journalId: null
        });

        let paymentId = this.createPayment(entity);

        this.eventBus.send('onChequeStatusChanged', paymentId);
        return paymentId;

    }

    setJournalForSpend(receiveId, paymentId, journalId) {
        let receive = this.treasuryRepository.findById(receiveId),
            receiveEntity = this.mapToEntity(receive),
            payment = this.treasuryRepository.findById(paymentId),
            paymentEntity = this.mapToEntity(payment);

        receiveEntity.journalId = journalId;
        paymentEntity.journalId = journalId;

        receiveEntity.documentDetail.chequeStatusHistory =
            receive.documentDetail.chequeStatusHistory.asEnumerable()
                .select(item => ({
                    createdAt: item.createdAt,
                    status: item.status,
                    journalId: item.status === receive.documentDetail.status ? journalId : null,
                    order: item.order
                }))
                .toArray();

        receiveEntity.documentDetail.chequeStatusHistory = JSON.stringify(receiveEntity.documentDetail.chequeStatusHistory);

        paymentEntity.documentDetail.chequeStatusHistory =
            payment.documentDetail.chequeStatusHistory.asEnumerable()
                .select(item => ({
                    createdAt: item.createdAt,
                    status: item.status,
                    journalId: item.status === payment.documentDetail.status ? journalId : null,
                    order: item.order
                }))
                .toArray();

        paymentEntity.documentDetail.chequeStatusHistory = JSON.stringify(paymentEntity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(receiveId, receiveEntity);
        return this.treasuryRepository.update(paymentId, paymentEntity);
    }
}