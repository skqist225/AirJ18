export interface IAmentities {
    name: string;
    icon: string;
    id: number;
}

export interface IRule {
    icon: string;
    title: string;
}

export interface IReview {
    comment: string;
    rating: {
        cleanliness: number;
        contact: number;
        checkin: number;
        accuracy: number;
        location: number;
        value: number;
    };
    customer_name: string;
    customer_avatar: string;
    created_at: string;
}

export interface IHost {
    id: number;
    name: string;
    avatar: string;
}

export type IRoomDetails = {
    bed: number;
    name: string;
    description: string;
    thumbnail: string;
    amenitities: IAmentities[];
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
} | null;
