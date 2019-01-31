import { Column, Entity, PrimaryColumn } from "typeorm";
import { User as IUser } from '../Infrastructure/ApplicationCycle'
import { UserProfile } from "./userProfile.entity";
import { join } from "path";
import { type } from "os";

@Entity('users')
export class User implements IUser {
    constructor() {
        this.profiles = this.profiles || [];
    }

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    token: string;

    @Column()
    email: string;

    @Column()
    mobile: string;

    @Column()
    state: UserState;

    image: string;

    password: string;
    isActiveMobile: boolean;
    isActiveEmail: boolean;

    profiles: UserProfile[];

    @Column('json', {name: 'custom_fields'})
    customFields: UserCustomFields;

    role: string;
}

export enum UserState {
    ACTIVE = 'active',
    PENDING = 'pending',
    BLOCKED = 'blocked'
}

export interface UserCustomFields {
    shouldChangePassword: boolean;
}