export interface IAddUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    sex: string;
    birthday: string;
}

export interface IAddress {
    country: { name: string; id: number };
    state: { name: string; id: number };
    city: {
        name: string;
        id: number;
    };
    aprtNoAndStreet: string;
}

export interface IUser extends IAddUser {
    id: number;
    avatarPath: string;
    fullPathAddress: string;
    addressDetails: IAddress;
}

export type ILoginInfo = {
    email: string;
    password: string;
};
