import { Repository, EntityRepository, getRepository } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "src/Infrastructure/DependencyInjection";
import { UserProfile, OauthProviders } from "./userProfile.entity";

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private readonly profileRepository = getRepository(UserProfile);

    async findProfile(provider: OauthProviders, providerUserId: string): Promise<UserProfile> {
        return this.profileRepository.findOne({ provider, providerUserId });
    }

    async findByEmailOrMobile(email: string, mobile: string): Promise<User> {
        return this.createQueryBuilder('user')
        .where('user.email ILIKE :email OR user.mobile = :mobile',{email, mobile})
        .getOne()
    }
}