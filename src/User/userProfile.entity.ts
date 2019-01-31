import { Entity } from "typeorm";
import { User } from "./user.entity";

@Entity('users_oauth_profiles')
export class UserProfile {
    id: number;
    provider: OauthProviders;
    providerUserId: string;
    token: string;
    profile: any;
    user: User;
}

export enum OauthProviders {
    GOOGLE = 'google',
    TINET = 'tinet',
    PAYPING = 'payping'
}