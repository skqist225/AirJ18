import IHost from './type_Host';
import { IReview } from './type_Review';

export interface IRDAmenity {
    name: string;
    icon: string;
    id: number;
}

export interface IRule {
    icon: string;
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
    amenitities: IRDAmenity[];
    images: string[];
    latitude: number;
    privacy: string;
    average_rating: number;
    rules: IRule[];
    bedroom: number;
    stay_type: string;
    reviews: IReview[];
    price: number;
    location: string;
    guest: number;
    currency: string;
    id: number;
    bathroom: number;
    host: IHost;
    longitude: number;
    image_prefix: string;
} | null;
