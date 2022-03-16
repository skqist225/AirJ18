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

export interface IRoomLocalStorage {
    roomGroup?: number;
    roomGroupText?: string;
    category?: number;
    privacyType?: number;
    longitude?: number;
    latitude?: number;
    placeName?: string;
    guestNumber?: number;
    bedNumber?: number;
    bedRoomNumber?: number;
    bathRoomNumber?: number;
    prominentAmentity?: number;
    favoriteAmentity?: number;
    safeAmentity?: number;
    prominentAmentityImageName?: string;
    favoriteAmentityImageName?: string;
    safeAmentityImageName?: string;
    prominentAmentityName?: string;
    favoriteAmentityName?: string;
    safeAmentityName?: string;
    roomImages?: string[];
    roomTitle?: string;
    descriptions?: string[];
    roomPricePerNight?: string;
}

export interface IPostAddRoom {
    name: string;
    amentities: number[];
    images: string[];
    country: number;
    state: string;
    city: string;
    street: string;
    bedroomCount: number;
    bathroomCount: number;
    accomodatesCount: number;
    bedCount: number;
    currency: number;
    category: number;
    roomGroup: number;
    description: string;
    latitude: number;
    longitude: number;
    price: number;
    priceType: string;
    host: number;
    privacyType: number;
}
