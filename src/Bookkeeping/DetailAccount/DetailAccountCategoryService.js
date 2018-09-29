import {inject, injectable} from "inversify";

@injectable()
export class DetailAccountCategoryService {

    /**@type {DetailAccountCategoryRepository}*/
    @inject("DetailAccountCategoryRepository") detailAccountCategoryRepository = undefined;

    create(cmd) {

        let errors = [];

        if (!(cmd.subsidiaryLedgerAccountIds && cmd.subsidiaryLedgerAccountIds.length > 0))
            errors.push('لیست معین ها وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subsidiaryLedgerAccountIds = cmd.subsidiaryLedgerAccountIds.join('|'),
            entity = {
                title: cmd.title,
                subsidiaryLedgerAccountIds
            };

        this.detailAccountCategoryRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {

        let errors = [];

        const category = this.detailAccountCategoryRepository.findById(id);

        if (!category)
            throw new NotFoundException();

        if (!(cmd.subsidiaryLedgerAccountIds && cmd.subsidiaryLedgerAccountIds.length > 0))
            errors.push('لیست معین ها وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subsidiaryLedgerAccountIds = cmd.subsidiaryLedgerAccountIds.join('|');

        this.detailAccountCategoryRepository.update(id, {title: cmd.title, subsidiaryLedgerAccountIds});

    }

    remove(id) {

        const category = this.detailAccountCategoryRepository.findById(id);

        if (!category)
            throw new NotFoundException();

        this.detailAccountCategoryRepository.remove(id);
    }
}