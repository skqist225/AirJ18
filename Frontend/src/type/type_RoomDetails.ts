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
    bedroom: 9;
    stay_type: string;
    reviews: IReview[];
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
