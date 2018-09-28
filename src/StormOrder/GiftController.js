import {Controller, Get, WithoutControlPermissions} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/storm-gifts")
@WithoutControlPermissions()
class StormGiftController {

    @inject("GiftQuery")
    /** @type {GiftQuery}*/ giftQuery = undefined;

    @inject("BranchQuery")
    /** @type {BranchQuery}*/ branchQuery = undefined;

    @Get("/:code/:branchId/isValid")
    verifyGift(req) {
        let branch = this.branchQuery.find({id: req.params.branchId}, true),
            userId = branch.ownerId,
            gift = this.giftQuery.find({code: req.params.code}, true);

        if (!gift)
            return {isValid: false, message: 'کد تخفیف وارد شده وجود ندارد'};

        let now = Utility.PersianDate.current(),
            isInRange = now >= gift.minDate && now <= gift.maxDate;

        if (!isInRange)
            return {isValid: false, message: 'کد تخفیف جاری در این تاریخ قابل استفاده نمیباشد'};

        let isUsedGift = this.giftQuery.isUsed(gift.id, userId);

        if (isUsedGift)
            return {isValid: false, message: 'شما قبلا از این کد تخفیف استفاده کرده اید'};

        return {isValid: true, gift};

    }
}