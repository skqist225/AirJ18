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
    customerName: string;
    customerAvatar: string;
    createdAt: string;
}
