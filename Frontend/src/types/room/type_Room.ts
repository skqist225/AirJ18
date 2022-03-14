export interface IRoom {
    id: number;
    thumbnail: string;
    images: string[];
    likedByUsers: number[];
    price: number;
    name: string;
    currencySymbol: string;
    stayType: string;
}

export interface IRoomPrivacy {
    id: number;
    name: string;
    description: string;
}

export interface IRoomGroup {
    id: number;
    name: string;
    image: string;
}
