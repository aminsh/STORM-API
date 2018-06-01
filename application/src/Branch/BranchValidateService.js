import {injectable, inject} from "inversify";
import queryString from "query-string";

const Enums = instanceOf('Enums');


@injectable()
export class BranchValidateService {

    @inject("BranchRepository")
    /** @type {BranchRepository}*/ branchRepository = undefined;

    @inject("StormPlanRepository")
    /** @type {StormPlanRepository}*/ stormPlanRepository = undefined;

    @inject("BranchSubscriptionRepository")
    /** @type {BranchSubscriptionRepository}*/ branchSubscriptionRepository = undefined;

    validate(id, caller, url) {

        let branch = this.branchRepository.findById(id),
            subscription = this.branchSubscriptionRepository.getLast(id),
            plan = this.stormPlanRepository.findById(subscription.planId);

        if (branch.status === 'expired' && caller === 'STORM-Dashboard')
            return {canExecute: false, message: 'The branch is expired'};

        if (branch.status === 'expired' && !subscription.isActiveApi)
            return {canExecute: false, message: 'The branch is expired'};

        let feature = queryString.parseUrl(url).url.split("/").filter(item => item)[1];


        let canExecute = caller === 'STORM-Dashboard'
            ? this._Validate(feature, plan.features.dashboard)
            : this._Validate(feature, plan.features.api);

        if (!canExecute)
            return {canExecute, message: 'This feature is not active'};

        return {canExecute};
    }

    _Validate(feature, allowedFeatures) {
        let values = Enums.Features().data
            .asEnumerable()
            .where(item => allowedFeatures.includes(item.key) || item.key === 'other')
            .selectMany(item => item.value)
            .toArray();

        return values.includes(feature);
    }

}
