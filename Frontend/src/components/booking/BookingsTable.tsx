import { FC } from "react";
import { IBooking } from "../../types/booking/type_Booking";
import BookingDataRow from "./BookingDataRow";
import { ColumnHeader } from "../utils";

interface IBookingsTableProps {
    bookings: IBooking[];
}

const BookingsTable: FC<IBookingsTableProps> = ({ bookings }) => {
    return (
        <>
            {bookings.length ? (
                <>
                    <table id='table'>
                        <thead>
                            <tr>
                                <th style={{ width: "7%" }}>
                                    <ColumnHeader columnName='MÃ ĐẶT PHÒNG' sortField='id' />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='NHÀ/PHÒNG CHO THUÊ'
                                        sortField='room-name'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader columnName='TRẠNG THÁI' sortField='isComplete' />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='NGÀY ĐẶT PHÒNG'
                                        sortField='bookingDate'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='NGÀY CHECKIN'
                                        sortField='checkinDate'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='NGÀY CHECKOUT'
                                        sortField='checkoutDate'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='KHÁCH HÀNG'
                                        sortField='customer-fullName'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader columnName='PHÍ DỊCH VỤ' sortField='siteFee' />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='GIÁ MỖI ĐÊM'
                                        sortField='pricePerDay'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='TỔNG SỐ NGÀY'
                                        sortField='numberOfDays'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader columnName='TỔNG CỘNG' sortField='totalFee' />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='PHÍ HOÀN TRẢ'
                                        sortField='refundPaid'
                                    />
                                </th>
                                <th>
                                    <ColumnHeader
                                        columnName='THAO TÁC'
                                        sortField=''
                                        isSortableHeader={false}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <BookingDataRow bookingRowData={booking} key={booking.bookingId} />
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <div
                    style={{ fontSize: "18px", lineHeight: "24px" }}
                    className='flex-2 fw-600 flex-center w100-h100'
                >
                    <h3> Không tìm thấy kết quả</h3>
                </div>
            )}
        </>
    );
};

export default BookingsTable;
