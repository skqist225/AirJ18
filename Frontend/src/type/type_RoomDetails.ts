export interface IAmentities {
    name: string;
    icon: string;
    id: number;
}

export interface IRule {
    icon: string;
    title: string;
}

export type IRoomDetails = {
    bed: number;
    name: string;
    thumbnail: string;
    amenitities: IAmentities[];
    images: string[];
    latitude: number;
    privacy: string;
    average_rating: number;
    rules: IRule[];
    bedroom: 9;
    stay_type: string;
    reviews: [];
    price: number;
    host_avatar: string;
    location: string;
    guest: number;
    currency: string;
    id: number;
    bathroom: number;
    host_name: string;
    longitude: number;
} | null;
