export class Context implements IContext {
    readonly branchId: string;
    readonly fiscalPeriodId: string;
    readonly request?: Request;
    readonly user: User;
}

export function getCurrentContext(): IContext {
    return null;
}