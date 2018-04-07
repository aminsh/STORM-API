import {inject, injectable} from "inversify";

@injectable()
export class PayableChequeDomainService {

    @inject("ChequeCategoryRepository")
    /** {ChequeCategoryRepository}*/chequeCategoryRepository = undefined;

    generateFromCategory(category) {
        let cheques = [],
            lastPageNumber = category.firstPageNumber + category.totalPages - 1;

        for (let i = category.firstPageNumber; i <= lastPageNumber; i++)
            cheques.push({
                number: i,
                isUsed: false
            });

        category.cheques = cheques;
    }

    issue(chequeNumber, bankId, treasuryPayableChequeId) {

        let firstOpenCategory = this.chequeCategoryRepository.findOne({bankId, isClosed: false});

        if (!firstOpenCategory)
            return;

        let cheque = firstOpenCategory.cheques.asEnumerable().firstOrDefault(item => item.number === parseInt(chequeNumber));

        if (!cheque)
            return;

        cheque.isUsed = true;
        cheque.treasuryPayableChequeId = treasuryPayableChequeId;

        let entity = {
            cheques: JSON.stringify(firstOpenCategory.cheques)
        };

        if (firstOpenCategory.cheques.asEnumerable().all(item => item.isUsed))
            entity.isClosed = true;

        this.chequeCategoryRepository.update(firstOpenCategory.id, entity);
    }

    getCheque(bankId) {
        let firstOpenCategory = this.chequeCategoryRepository.findOne({bankId, isClosed: false}),
            cheque = firstOpenCategory.cheques.asEnumerable()
                .orderBy(item => item.number)
                .first(item => !item.isUsed);

        return cheque.number;
    }

}