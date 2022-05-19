import IHost from "../type_Host";
import { IReview } from "../type_Review";

export interface IRDAmenity {
    name: string;
    icon: string;
    id: number;
}

export interface IRule {
    iconPath: string;
    title: string;
}

export interface IBookedDate {
    checkinDate: string;
    checkoutDate: string;
}

export type IRoomDetails = {
    bed: number;
    name: string;
    description: string;
    bookedDates: IBookedDate[];
    thumbnail: string;
    amenities: IRDAmenity[];
    images: string[];
    latitude: number;
    privacy: string;
    averageRating: number;
    rules: IRule[];
    bedroom: number;
    stayType: string;
    reviews: IReview[];
    price: number;
    location: string;
    guest: number;
    currencySymbol: string;
    currencyUnit: string;
    id: number;
    bathroom: number;
    host: IHost;
    longitude: number;
    image_prefix: string;
    cityName: string;
    category: string;
    likedByCurrentUser: boolean;
    status: boolean;
    accomodates: number;
    groupId: number;
    groupName: string;
    categoryId: number;
    privacyId: number;
    stateName: string;
    countryName: string;
    streetName: string;
};
