import {inject, injectable} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class TreasuryChequeDomainService {
    /** @type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /** @type {PayableChequeDomainService}*/
    @inject("PayableChequeDomainService") payableChequeDomainService = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    mapToEntity(cmd) {

        let treasury = cmd.id ? this.treasuryRepository.findById(cmd.id) : null;

        return {
            id: cmd.id,
            transferDate: cmd.transferDate || PersianDate.current(),
            sourceDetailAccountId: cmd.payerId || null,
            destinationDetailAccountId: cmd.receiverId || null,
            amount: cmd.amount,
            imageUrl: JSON.stringify(cmd.imageUrl || []),
            description: cmd.description,
            treasuryType: cmd.treasuryType,
            documentType: cmd.documentType,
            journalId: cmd.journalId,
            receiveId: cmd.receiverId,
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
        entity.documentDetail.canTransferToAnother = entity.documentDetail.canTransferToAnother || true;

        entity = this.treasuryRepository.create(entity);

        if (entity.documentType !== 'spendCheque')
            this.eventBus.send('onChequeCreated', entity.id);

        return entity.id;
    }

    update(id, cmd) {
        let entity = this.mapToEntity(cmd),
            persistedTreasury = this.treasuryRepository.findById(id),
            errors = persistedTreasury.treasuryType === 'receive' ? this._receiveValidate(entity)
                : this._paymentValidate(entity);

        if (!persistedTreasury)
            errors.push('{0} وجود ندارد!'.format(Enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)));

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.treasuryRepository.update(id, entity);

    }

    remove(id) {
        this.treasuryRepository.remove(id);
    }

    setJournal(id, journalId) {
        let persistedTreasury = this.treasuryRepository.findById(id);

        if (persistedTreasury.documentType === 'spendCheque')
            return this.setJournalForSpend(persistedTreasury.receiveId, id, journalId);

        persistedTreasury.journalId = journalId;
        persistedTreasury.documentDetail.chequeStatusHistory =
            persistedTreasury.documentDetail.chequeStatusHistory.asEnumerable()
                .select(item => ({
                    createdAt: item.createdAt,
                    status: item.status,
                    journalId: item.status === persistedTreasury.documentDetail.status ? journalId : item.journalId
                }))
                .toArray();

        persistedTreasury.documentDetail.chequeStatusHistory = JSON.stringify(persistedTreasury.documentDetail.chequeStatusHistory);

        return this.treasuryRepository.update(id, persistedTreasury);
    }

    chequeInFund(id, cmd) {
        let cheque = this.treasuryRepository.findById(id);
        cheque.isCompleted = false;
        cheque.documentDetail.status = 'inFund';

        cheque.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        cheque.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'inFund',
            journalId: null
        });
        cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(cheque.id, cheque);
    }

    receiveChequePass(id, cmd) {
        let cheque = this.treasuryRepository.findById(id);
        cheque.destinationDetailAccountId = cmd.receiverId;
        cheque.transferDate = cmd.date || null;
        cheque.documentDetail.status = 'passed';
        cheque.isCompleted = true;

        cheque.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        cheque.documentDetail.chequeStatusHistory.push({
            createdAt: cmd.date || new Date(),
            status: 'passed',
            journalId: null
        });
        cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(cheque.id, cheque);
    }

    paymentChequePass(id, cmd) {
        let cheque = this.treasuryRepository.findById(id);
        cheque.sourceDetailAccountId = cmd.payerId;
        cheque.transferDate = cmd.date || null;
        cheque.documentDetail.status = 'passed';
        cheque.isCompleted = true;

        cheque.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        cheque.documentDetail.chequeStatusHistory.push({
            createdAt: cmd.date || new Date(),
            status: 'passed',
            journalId: null
        });
        cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(cheque.id, cheque);
    }

    chequeInProcess(id, cmd) {
        let cheque = this.treasuryRepository.findById(id);
        cheque.isCompleted = false;
        cheque.documentDetail.status = 'inProcessOnPassing';

        cheque.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        cheque.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'inProcessOnPassing',
            journalId: null
        });
        cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(cheque.id, cheque);
    }

    chequeReturn(id, cmd) {
        let cheque = this.treasuryRepository.findById(id);
        cheque.isCompleted = false;
        cheque.documentDetail.status = 'return';
        cheque.documentDetail.trackingNumber = cmd.trackingNumber || null;
        cheque.documentDetail.transferTo = cmd.transferTo || null;

        cheque.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        cheque.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'return',
            journalId: null
        });
        cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(cheque.id, cheque);
    }

    chequeRevocation(id, cmd) {
        let cheque = this.treasuryRepository.findById(id);
        cheque.isCompleted = false;
        cheque.documentDetail.status = 'revocation';

        cheque.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        cheque.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'revocation',
            journalId: null
        });
        cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(cheque.id, cheque);
    }

    chequeMissing(id, cmd) {
        let cheque = this.treasuryRepository.findById(id);
        cheque.isCompleted = false;
        cheque.documentDetail.status = 'missing';

        cheque.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
        cheque.documentDetail.chequeStatusHistory.push({
            createdAt: new Date(),
            status: 'missing',
            journalId: null
        });
        cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);

        this.eventBus.send('onChequeStatusChanged', id);

        return this.treasuryRepository.update(cheque.id, cheque);
    }

    chequeSpend(receiveId, cmd) {
        let cheque = receiveId ? this.treasuryRepository.findById(receiveId) : null,
            receiver = this.detailAccountRepository.findById(cmd.receiverId);


        if (receiver.detailAccountType !== 'person')
            throw new ValidationException('دریافت کننده چک باید شخص باشد.');

        if (cheque) {
            cheque.isCompleted = true;
            cheque.documentDetail.status = 'spend';
            cheque.destinationDetailAccountId = cmd.receiverId;

            cheque.documentDetail.chequeStatusHistory = cheque.documentDetail.chequeStatusHistory || [];
            cheque.documentDetail.chequeStatusHistory.push({
                createdAt: new Date(),
                status: 'spend',
                journalId: null
            });
            cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);

            this.treasuryRepository.update(cheque.id, cheque);
        }

        cheque.documentDetail.chequeStatusHistory = [];
        cheque.documentDetail.chequeStatusHistory = JSON.stringify(cheque.documentDetail.chequeStatusHistory);
        cheque.receiveId = receiveId;
        cheque.documentType = 'spendCheque';

        let paymentId = this.createPayment(cheque);
        this.eventBus.send('onChequeStatusChanged', [receiveId, paymentId]);

        return paymentId;
    }

    setJournalForSpend(receiveId, paymentId, journalId) {
        let receive = this.treasuryRepository.findById(receiveId),
            payment = this.treasuryRepository.findById(paymentId);

        receive.journalId = journalId;
        payment.journalId = journalId;

        receive.documentDetail.chequeStatusHistory =
            receive.documentDetail.chequeStatusHistory.asEnumerable()
                .select(item => ({
                    createdAt: item.createdAt,
                    status: item.status,
                    journalId: item.status === receive.documentDetail.status ? journalId : item.journalId
                }))
                .toArray();

        receive.documentDetail.chequeStatusHistory = JSON.stringify(receive.documentDetail.chequeStatusHistory);

        payment.documentDetail.chequeStatusHistory =
            payment.documentDetail.chequeStatusHistory.asEnumerable()
                .select(item => ({
                    createdAt: item.createdAt,
                    status: item.status,
                    journalId: item.status === payment.documentDetail.status ? journalId : item.journalId
                }))
                .toArray();

        payment.documentDetail.chequeStatusHistory = JSON.stringify(payment.documentDetail.chequeStatusHistory);

        this.treasuryRepository.update(receiveId, receive);
        return this.treasuryRepository.update(paymentId, payment);
    }
}