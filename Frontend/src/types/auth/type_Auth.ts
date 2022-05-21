export interface IForgotPassword {
    email: string;
}

export type ILogin = {
    password: string;
} & IForgotPassword;

export interface IResetPassword {
    email: string;
    resetPasswordCode: number;
    newPassword: string;
    confirmNewPassword: string;
}
