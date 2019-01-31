import { Controller, Post, Body, Query, Put, Request, Parameters } from "../Infrastructure/ExpressFramework";
import { UserService } from "./user.service";
import { UserLoginByProvider, UserUpdateDTO, UserLoginDTO } from "./user.dto";
import { UserTokenValidateMiddleware, ShouldAuthenticatedMiddleware } from "./shouldAthenticated.middleware";

@Controller('/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('/register')
    async register(
        @Body() dto: any,
        @Query('loginByGoogle') loginByGoogle: boolean,
        @Query('loginByTinet') loginByTinet: boolean,
    ): Promise<any> {

        if (loginByGoogle) {
            let data = dto as UserLoginByProvider;
            let id = await this.userService.registerByGoogle(data.token, data.profile);

            return { id };
        }

        if (loginByTinet) {
            let data = dto as UserLoginByProvider;
            let id = await this.userService.registerByTinet(data.token, data.profile);

            return { id };
        }

        let result = await this.userService.register(dto);

        return { user: { id: result }, duration: result.duration };
    }

    @Put('/', { middleware: [ UserTokenValidateMiddleware ] })
    async update(@Body() dto: UserUpdateDTO, @Request() req: any): Promise<any> {
        await this.userService.update(dto);
        return { id: req.user.id };
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDTO): Promise<any> {
        const id = await this.userService.login(dto);
        return { id };
    }

    @Post('/logout', { middleware: [ ShouldAuthenticatedMiddleware ] })
    async logout(): Promise<void> {
        await this.userService.regenerateToken();
    }

    @Post('/mobile-entry', { middleware: [ UserTokenValidateMiddleware ] })
    async mobileEntry(@Body('mobile') mobile: string): Promise<any> {
        const result = await this.userService.mobileEntry(mobile);
        return { message: 'کد فعالسازی به موبایل شما ارسال خواهد شد', ...result };
    }

    @Post('/verify-mobile/:code')
    async verifyMobile(@Parameters('code') code: string) {
        const id = await this.userService.verifyMobile(code);
        return { id };
    }

    @Put("/change-password", { middleware: [ ShouldAuthenticatedMiddleware ] })
    async changePassword(@Body('password') password: string): Promise<void> {
        await this.userService.changePassword(password);
    }

    @Put("/change-image", { middleware: [ UserTokenValidateMiddleware ] })
    async changeImage(@Body('image') image: string): Promise<void> {
        await this.userService.changeImage(image);
    }

    @Post('/reset-password/by-mobile')
    async resetPasswordByMobile(@Body('mobile') mobile: string) {
        await this.userService.resetPasswordByMobile(mobile);
    }
}