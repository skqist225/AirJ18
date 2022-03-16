export interface IBooking {
    bookingId: number;
    roomId: number;
    roomName: string;
    roomThumbnail: string;
    bookingDate: string;
    cancelDate: string;
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
