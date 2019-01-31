export class UserLoginDTO {
    mobile: string;
    email: string;
    password: string
}

export class UserRegisterDTO {
    mobile: string;
    email: string;
    password: string;
    name: string;
}

export class UserLoginByProvider {
    token: string;
    profile: any;
}

export class UserUpdateDTO {
    mobile: string;
    email: string;
    name: string;
}