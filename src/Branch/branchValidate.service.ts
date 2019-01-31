import { Injectable } from "../Infrastructure/DependencyInjection";
import { BranchRepository } from "./branch.repository";
import { Branch, BranchStatus } from "./branch.entity";
import { Enumerable } from "../Infrastructure/Utility";
import * as queryString from 'query-string';
import { Configuration } from "src/Config/Configuration";

@Injectable()
export class BranchValidateService {
    constructor(private readonly branchRepository: BranchRepository,
        private readonly config: Configuration) { }

    validate(branch: Branch, caller: string, url: string): BranchValidateResult {
        if (branch.isUnlimited)
            return { canExecute: true };

        let lastSubscription = Enumerable.from(branch.subscriptions)
            .orderByDescending(item => item.id)
            .firstOrDefault();

        if (branch.status === BranchStatus.EXPIRED && caller === 'STORM-Dashboard')
            return { canExecute: false, message: 'The branch is expired' };

        if (branch.status === BranchStatus.EXPIRED && !lastSubscription.isActiveApi)
            return { canExecute: false, message: 'The branch is expired' };

        let feature = queryString.parseUrl(url).url.split("/").filter(item => item)[1];

        let canExecute = caller === 'STORM-Dashboard'
            ? this.validateFeature(feature, lastSubscription.plan.features.dashboard)
            : this.validateFeature(feature, lastSubscription.plan.features.api);

        if (!canExecute)
            return { canExecute: true, message: 'This feature is not active' };

        return { canExecute };
    }

    private validateFeature(feature: string, allowedFeatures: string[]): boolean {
        let routes = this.config.FEATURES.other.routes;

        allowedFeatures.forEach(key => routes = routes.concat(this.config.FEATURES[key]['routes']));

        return Enumerable.from(routes).contains(feature);
    }
}

interface BranchValidateResult {
    canExecute: boolean;
    message?: string;
}
