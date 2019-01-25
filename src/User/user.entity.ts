import {Column, Entity, PrimaryColumn} from "typeorm";
import {User as IUser} from '../Infrastructure/ApplicationCycle'

@Entity('users')
export class User implements IUser {
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
}