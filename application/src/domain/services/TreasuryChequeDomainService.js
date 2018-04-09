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

        let treasury = cmd.id ? this.treasuryRepository.findById(cmd.id) : null;

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
            //chequeStatusHistory: documentDetail.chequeStatusHistory || [],
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
        let errors = [];

        if (entity.isCompleted && entity.documentDetail.status === 'passed')
            errors.push('چک قبلا پاس شده است!');

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
        this.eventBus.send('onChequeCreated', entity.id);
        return entity.id;
    }

    createPayment(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._paymentValidate(entity),
            cheque = this.treasuryRepository.findByNumber(entity.documentDetail.number);

        if (cheque && cheque.sourceDetailAccountId === entity.sourceDetailAccountId)
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

    update(id, cmd) {
        let entity = this.mapToEntity(cmd),
            persistedTreasury = this.treasuryRepository.findById(id),
            errors = persistedTreasury.treasuryType === 'receive' ? this._receiveValidate(entity)
                : this._paymentValidate(entity),

            journalService = this.journalDomainService,
            treasuryJournalGeneration = this.treasuryJournalGenerationDomainService,

            journals = persistedTreasury.documentDetail.chequeStatusHistory
                ? persistedTreasury.documentDetail.chequeStatusHistory.asEnumerable()
                    .where(e => e.journalId)
                    .select(item => ({
                        journalId: item.journalId,
                        status: item.status
                    }))
                    .toArray()
                : persistedTreasury.journalId ? [persistedTreasury.journalId] : null;

        if (!persistedTreasury)
            errors.push('{0} وجود ندارد!'.format(Enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)));

        if(persistedTreasury.documentDetail.status === 'passed')
            errors.push('چک وصول شده قابل ویرایش نمی باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.journalId = null;
        this.treasuryRepository.update(id, entity);

        if (journals) {
            let journalIds = [];

            journals.forEach(item => journalService.remove(item.journalId));
            journals.forEach(item => journalIds.push(treasuryJournalGeneration.generateForChequeWithStatus(id,item.status)));

            journalIds.forEach(item => this.setJournal(id, item));
        }

    }

    remove(id) {
        let persistedTreasury = this.treasuryRepository.findById(id),
            journalService = this.journalDomainService,

            journalIds = persistedTreasury.documentDetail.chequeStatusHistory
                ? persistedTreasury.documentDetail.chequeStatusHistory.asEnumerable()
                    .where(e => e.journalId)
                    .select(item => item.journalId)
                    .toArray()
                : persistedTreasury.journalId ? [persistedTreasury.journalId] : null;

        this.treasuryRepository.remove(id);


        if (journalIds)
            journalIds.forEach(item => journalService.remove(item));
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
            status: 'inFund',
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(entity.id, entity);
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
            passedDate: cmd.date,
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(entity.id, entity);
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
            passedDate: cmd.date,
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(entity.id, entity);
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
            status: 'inProcessOnPassing',
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(entity.id, entity);
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
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(entity.id, entity);
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
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(entity.id, entity);
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
            journalId: null
        });
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(entity.id, entity);
    }

    chequeSpend(receiveId, cmd) {
        let cheque = receiveId ? this.treasuryRepository.findById(receiveId) : null,
            receiver = this.detailAccountRepository.findById(cmd.receiverId),
            entity = this.mapToEntity(cheque),
            errors = this._changeStatusValidate(entity);

        if (entity.documentDetail.status === 'spend')
            errors.push('چک با وضعیت خرج/ انتقالی ثبت شده است!');

        if (receiver.detailAccountType !== 'person')
            errors.push('دریافت کننده چک باید شخص باشد.');

        if (errors.length > 0)
            throw new ValidationException(errors);


        if (cheque) {
            entity.isCompleted = true;
            entity.documentDetail.status = 'spend';
            entity.destinationDetailAccountId = cmd.receiverId;

            entity.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
            entity.documentDetail.chequeStatusHistory.push({
                createdAt: new Date(),
                status: 'spend',
                journalId: null
            });
            entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);

            this.treasuryRepository.update(entity.id, entity);
        }

        entity.documentDetail.chequeStatusHistory = [];
        entity.documentDetail.chequeStatusHistory = JSON.stringify(entity.documentDetail.chequeStatusHistory);
        entity.receiveId = receiveId;
        entity.documentType = 'spendCheque';
        entity.isCompleted = false;
        entity.documentDetail.status = 'inProcessOnPassing';

        let paymentId = this.createPayment(entity);
        this.eventBus.send('onChequeStatusChanged', [receiveId, paymentId]);

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
                    journalId: item.status === receive.documentDetail.status ? journalId : null
                }))
                .toArray();

        receiveEntity.documentDetail.chequeStatusHistory = JSON.stringify(receiveEntity.documentDetail.chequeStatusHistory);

        paymentEntity.documentDetail.chequeStatusHistory =
            payment.documentDetail.chequeStatusHistory.asEnumerable()
                .select(item => ({
                    createdAt: item.createdAt,
                    status: item.status,
                    journalId: item.status === payment.documentDetail.status ? journalId : null
                }))
                .toArray();

        paymentEntity.documentDetail.chequeStatusHistory = JSON.stringify(paymentEntity.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(receiveId, receiveEntity);
        return this.treasuryRepository.update(paymentId, paymentEntity);
    }
}