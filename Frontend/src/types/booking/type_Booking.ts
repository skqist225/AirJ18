export interface IBooking {
    bookingId: number;
    roomName: string;
    roomThumbnail: string;
    bookingDate: string;
    checkinDate: string;
    checkoutDate: string;
    pricePerDay: number;
    numberOfDays: number;
    siteFee: number;
    refundPaid: number;
    complete: boolean;
    refund: boolean;
    customerName: string;
    customerAvatar: string;
    roomCurrency: string;
}
