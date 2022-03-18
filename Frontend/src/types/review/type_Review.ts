export interface IRating {
    cleanliness: number;
    contact: number;
    checkin: number;
    accuracy: number;
    location: number;
    value: number;
}

export interface Review {
    id: number;
    customerAvatar: string;
    rating: IRating;
    comment: string;
    customerName: string;
    createdAt: string;
}
