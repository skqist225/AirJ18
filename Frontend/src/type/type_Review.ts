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
