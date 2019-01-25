import {getManager} from "typeorm";
import * as express from "express";
import {createNamespace, getNamespace} from 'cls-hooked';
import {Context, Request} from "../ExpressFramework/Types";

export interface User {
    id: string;
    name: string;
    email: string;
    mobile: string
}

/*interface Context {
    branchId: string;
    fiscalPeriodId: string;
    user: User;
}*/

/*export interface Request extends express.Request {
    currentContext: Context
}*/

interface ChangeSet {
    isRemove: boolean;
    entity: any;
}

interface UnitOfWork {
    changeSet: ChangeSet[];

    attach(entity: any | any[], isRemove?: boolean): Promise<void>;

    commit(): Promise<void>;

    reject(): Promise<void>
}

export class RequestContextImpl implements Context {
    constructor(private readonly request: Request) {
    }

    get branchId(): string {
        return this.request.currentContext.branchId;
    }

    get fiscalPeriodId(): string {
        return this.request.currentContext.fiscalPeriodId;
    }

    get user(): User {
        return this.request.currentContext.user;
    }
}

export class UnitOfWorkImpl implements UnitOfWork {
    changeSet: ChangeSet[] = [];

    async attach(entity: any | any[], isRemove: boolean = false): Promise<void> {
        if (Array.isArray(entity))
            entity.forEach(e => this.changeSet.push({entity: e, isRemove}));
        else
            this.changeSet.push({entity, isRemove});

        console.log('attached to unitOfWork');
    }

    async commit(): Promise<void> {
        await getManager().transaction(async transactionalEntityManager => {
            const removeEntities = this.changeSet.filter(c => c.isRemove),
                saveEntities = this.changeSet.filter(c => !c.isRemove);

            await transactionalEntityManager.remove(removeEntities);
            await transactionalEntityManager.save(saveEntities);
        });
    };

    async reject(): Promise<void> {
        this.changeSet = [];
    };
}

export function getCurrentContext(): Context {
    const session = getNamespace('STORM-SESSION');
    return session.get('CURRENT-CONTEXT');
}

export function getUnitOfWork(): UnitOfWork {
    return null;
}

export function Transactional(): Function {
    return function () {

    }
}





