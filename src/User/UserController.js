import {inject} from "inversify";
import {Controller, Get, Post, Put, NoLog, WithoutControlPermissions} from "../Infrastructure/expressUtlis";

@Controller("/v1/users")
@WithoutControlPermissions()
export class UserController {

    @inject("UserService")
    /** @type {UserService}*/ userService = undefined;

    @inject("UserQuery")
    /** @type {UserQuery}*/ userQuery = undefined;

    @Get("/")
    getAll(req) {
        return this.userQuery.getAll(req.query);
    }

    @Get("/current", "TokenIsValid")
    current(req) {

        return this.userQuery.getOne({id: req.user.id});
    }

    @Post("/register")
    @NoLog()
    register(req) {

        let loginByGoogle = req.query.loginByGoogle;

        if (loginByGoogle) {
            let id = this.userService.registerByGoogle(req.body.googleToken, req.body.profile);

            return {user: this.userQuery.getOne({id})};
        }

        let result = this.userService.register(req.body);

        return {user: this.userQuery.getOne({id: result.id}), duration: result.duration};
    }

    @Put("/", "TokenIsValid")
    @NoLog()
    update(req) {

        this.userService.update(req.body);

        return this.userQuery.getOne({id: req.user.id});
    }

    @Post("/login")
    @NoLog()
    login(req) {

        let id = this.userService.login(req.body);

        return this.userQuery.getOne({id});
    }

    @Post("/logout", "ShouldAuthenticated")
    @NoLog()
    logout() {

        this.userService.regenerateToken();
    }

    @Post("/mobile-entry", "TokenIsValid")
    @NoLog()
    mobileEntry(req) {

        let result = this.userService.mobileEntry(req.body.mobile);

        return Object.assign(result, {message: 'کد فعالسازی به موبایل شما ارسال خواهد شد'});
    }

    @Post("/verify-mobile/:code")
    @NoLog()
    verifyMobile(req) {

        let id = this.userService.verifyMobile(req.params.code);

        return this.userQuery.getOne({id});
    }

    @Put("/change-password", "ShouldAuthenticated")
    @NoLog()
    changePassword(req) {

        this.userService.changePassword(req.body.password);
    }

    @Put("/change-image", "ShouldAuthenticated")
    @NoLog()
    changeImage(req) {

        this.userService.changeImage(req.body.image);
    }

    @Post("/reset-password/by-mobile")
    @NoLog()
    resetPasswordByMobile(req) {

        this.userService.resetPasswordByMobile(req.body.mobile);
    }

    @Get("/is-unique-email/:email")
    isUniqueEmail(req) {
        return !this.userQuery.getByEmail(req.params.email);
    }

    @Get("/is-unique-mobile/:mobile")
    isUniqueMobile(req) {
        return !this.userQuery.getOne({mobile: req.params.mobile, state: 'active'})
    }
}