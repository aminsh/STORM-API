declare interface State {
    branchId: string;
    fiscalPeriodId: string;
    user: User;
    request?: Request
}

declare interface IContext extends State {
}

declare interface User {
    id: string;
    name: string;
    email: string;
    mobile: string
}



