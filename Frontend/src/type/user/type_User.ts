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

export interface IRatingLabel {
    label: string;
    stars: number[];
}

export interface IBookedRoom {
    roomId: number;
    bookingId: number;
    hostName: string;
    hostAvatar: string;
    roomThumbnail: string;
    roomName: string;
    bookingDate: string;
    checkinDate: string;
    checkoutDate: string;
    pricePerDay: number;
    numberOfDays: number;
    siteFee: number;
    currency: string;
    refund: boolean;
    complete: boolean;
    privacyType: string;
    roomCategory: string;
    priceType: string;
    bookingReview: string;
}

export interface IUserUpdate {
    updatedField: string;
    updateData: {};
}

export interface RoomWishlists {
    id: number;
    images: string[];
}
