export interface IAddUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    sex: string;
    birthday: [] | string;
}

export interface IUser extends IAddUser {
    id: number;
    avatarPath: string;
    fullPathAddress: string;
    address: {
        aprtNoAndStreet: string;
        city: {
            name: string;
            id: number;
        };
        state: { name: string; id: number };
        country: { name: string; id: number };
    };
    birthday: [];
}

export type ILoginInfo = {
    email: string;
    password: string;
};
