declare interface IUnitOfWork{
    commit(): void;
    rollback(e: any): void;
    init(): void
}