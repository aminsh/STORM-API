import {injectable, inject} from "inversify";

@injectable()
export class BranchService {

    @inject("BranchRepository")
    /** @type {BranchRepository}*/ branchRepository = undefined;

    @inject("EventBus")
    /**@type{EventBus}*/ eventBus = undefined;

    @inject("UserRepository")
    /**@type {UserRepository}*/ userRepository = undefined;

    @inject("State") /**@type{IState}*/ context = undefined;

    create(cmd, userId) {

        if (Utility.String.isNullOrEmpty(cmd.name))
            throw new ValidationSingleException('نام کسب و کار نباید خالی باشد');

        let entity = {
            name: cmd.name,
            ownerName: cmd.ownerName,
            logo: cmd.logo
                ? `/${cmd.logo}`
                : '',
            phone: cmd.phone,
            mobile: cmd.mobile,
            address: cmd.address,
            postalCode: cmd.postalCode,
            nationalCode: cmd.nationalCode,
            registrationNumber: cmd.registrationNumber,
            ownerId: userId,
            webSite: cmd.webSite,
            fax: cmd.fax,
            province: cmd.province,
            city: cmd.city,
            status: 'pending'
        };

        this.branchRepository.create(entity);

        this.eventBus.send("BranchCreated", entity.id);

        this.addUser(entity.id, entity.ownerId, true);

        return entity.id;
    }

    update(id, cmd) {

        let member = this.branchRepository.findMember(id, this.context.user.id);

        if (!(member && member.isOwner))
            throw new ValidationSingleException(['دسترسی تغییر در اطلاعات کسب و کار وجود ندارد']);

        let entity = {
            name: cmd.name,
            ownerName: cmd.ownerName,
            phone: cmd.phone,
            mobile: cmd.mobile,
            address: cmd.address,
            postalCode: cmd.postalCode,
            nationalCode: cmd.nationalCode,
            registrationNumber: cmd.registrationNumber,
            province: cmd.province,
            city: cmd.city,
            fax: cmd.fax
        };

        if (cmd.logoFileName)
            entity.logo = `/${cmd.logoFileName}`;

        this.branchRepository.update(id, entity);
    }

    archive(id) {

        const branch = this.branchRepository.findById(id);

        if (!branch)
            throw new NotFoundException();

        const member = this.branchRepository.findMember(id, this.context.user.id);

        if (!member)
            throw new ValidationSingleException('شما عضو این کسب و کار نیستید');

        if (!member.isOwner)
            throw new ValidationSingleException('شما صاحب این کسب و کار نیستید');

        this.branchRepository.update(id, {is_archive: true});
    }

    addUser(branchId, userId, asAOwner) {

        if (!asAOwner) {
            let createdByMember = this.branchRepository.findMember(branchId, this.context.user.id);

            if (!createdByMember)
                throw new ValidationSingleException('شما عضو این کسب و کار نیستید');

            if (!createdByMember.isOwner)
                throw new ValidationSingleException('شما مجوز اضافه کردن کاربر در این کسب و کار را ندارید');
        }

        let member = this.branchRepository.findMember(branchId, userId);

        if (member)
            throw new ValidationSingleException('کاربر عضو این کسب و کار هست');

        member = {
            userId,
            app: 'accounting',
            state: 'active',
            isOwner: asAOwner,
            token: Utility.TokenGenerator.generate256Bit()
        };

        this.branchRepository.addUser(branchId, member);

        return member;
    }

    addUserByEmailOrMobile(branchId, dto) {

        const dic = {mobile: 'موبایل', email: 'ایمیل'};

        let fieldName = Object.keys(dto).filter(key => ['mobile', 'email'].includes(key))[0];

        if(fieldName.length === 0)
            throw new ValidationException(['موبایل یا ایمیل وجود ندارد']);

        let user;

        if(fieldName === 'mobile')
            user = this.userRepository.findOne({mobile: dto.mobile});

        if(fieldName === 'email')
            user = this.userRepository.findByEmail(dto.email);

        if(!user)
            throw new ValidationException(['کاربر با {0} وارد شده وجود ندارد'.format(dic[fieldName])]);

        this.addUser(branchId, user.id);

    }

    removeUser(branchId, userId) {

        let createdByMember = this.branchRepository.findMember(branchId, this.context.user.id);

        if (!createdByMember)
            throw new ValidationSingleException('شما عضو این کسب و کار نیستید');

        if (!(createdByMember.isOwner || userId === this.context.user.id))
            throw new ValidationSingleException('شما مجوز حذف کاربر در این کسب و کار را ندارید');

        let member = this.branchRepository.findMember(branchId, userId);

        if (member.isOwner)
            throw new ValidationSingleException('امکان حذف صاحب کسب و کار وجود ندارد');

        this.branchRepository.removeUser(branchId, userId);

        return member;
    }

    regenerateMemberToken(branchId, userId) {

        let member = this.branchRepository.findMember(branchId, userId);

        let token = TokenGenerator.generate256Bit();

        this.branchRepository.updateUser(branchId, userId, {token});

        return {lastToken: member.token};
    }

}
