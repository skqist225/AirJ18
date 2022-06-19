import React, { FC } from "react";
import { Div, Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import { IBooking } from "../../types/booking/type_Booking";
import { MyNumberForMat } from "../utils";
import $ from "jquery";
import { useDispatch } from "react-redux";
import { approveBooking, cancelBooking } from "../../features/booking/bookingSlice";
import { Link } from "react-router-dom";

interface IBookingDataRowProps {
    bookingRowData: IBooking;
}

const BookingDataRow: FC<IBookingDataRowProps> = ({ bookingRowData }) => {
    let pageNumber = 1;
    const currentUrl = window.location.href;
    if (currentUrl.toString().includes("?")) {
        pageNumber = parseInt(currentUrl.split("?")[0].split("/").pop()!);
    } else {
        pageNumber = parseInt(window.location.href.split("/").pop()!);
    }

    function getMapSize(map: globalThis.Map<string, string>) {
        let len = 0;
        for (let key of Array.from(map.keys())) {
            len++;
        }

        return len;
    }

    const dispatch = useDispatch();
    function apprvBooking(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(approveBooking({ bookingid: $(event.currentTarget).data("booking-id") }));
    }

    function viewBooking(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const self = $(event.currentTarget);
        window.location.href = `${window.location.origin}/user/booked-rooms?query=${self.data(
            "booking-id"
        )}`;
    }

    function dropoutBooking(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(cancelBooking({ bookingid: $(event.currentTarget).data("booking-id") }));
    }

    const today = new Date().getTime();
    const checkinDate = new Date(bookingRowData!.checkinDate).getTime();

    console.log(bookingRowData.bookingId, today <= checkinDate);

    return (
        <>
            <tr data-room-id={bookingRowData.bookingId}>
                <td style={{ width: "7%" }}>
                    <div style={{ paddingLeft: "8px", textAlign: "center", paddingRight: "8px" }}>
                        <span>{bookingRowData.bookingId}</span>
                    </div>
                </td>
                <td style={{ width: "10%" }}>
                    <div className='normal-flex'>
                        <Link
                            to={`/room/${bookingRowData.roomId}`}
                            className='normal-flex'
                            style={{ color: "#222" }}
                        >
                            <Div width='56px' height='40px'>
                                <img
                                    src={getImage(bookingRowData.roomThumbnail)}
                                    alt="Room's thumbnail"
                                    className='listings__room-thumbnail'
                                />
                            </Div>
                            <div
                                className='listings__room-name'
                                style={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    maxWidth: "80%",
                                }}
                            >
                                {bookingRowData.roomName}
                            </div>
                        </Link>
                    </div>
                </td>
                <td>
                    <div className='h-100 normal-flex'>
                        <div>
                            {bookingRowData.complete === true && bookingRowData.refund === false && (
                                <div
                                    style={{
                                        padding: "1px 6px",
                                        borderRadius: "4px",
                                        backgroundColor: "rgb(203 244 201)",
                                        width: "90px",
                                    }}
                                >
                                    <span style={{ color: "rgba(14, 98, 69, 1)" }}>
                                        <svg
                                            aria-hidden='true'
                                            className='
                                                SVGInline-svg SVGInline--cleaned-svg
                                                SVG-svg
                                                Icon-svg Icon--check-svg Icon-color-svg
                                                Icon-color--green500-svg
                                            '
                                            height='12'
                                            width='12'
                                            viewBox='0 0 16 16'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                d='M5.297 13.213L.293 8.255c-.39-.394-.39-1.033 0-1.426s1.024-.394 1.414 0l4.294 4.224 8.288-8.258c.39-.393 1.024-.393 1.414 0s.39 1.033 0 1.426L6.7 13.208a.994.994 0 0 1-1.402.005z'
                                                fillRule='evenodd'
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className='booking-status fs-14 inline-block'
                                        style={{ paddingLeft: "4px" }}
                                    >
                                        Hoàn tất
                                    </span>
                                </div>
                            )}
                            {bookingRowData.complete === false && bookingRowData.refund === false && (
                                <div
                                    style={{
                                        padding: "1px 6px",
                                        borderRadius: "4px",
                                        backgroundColor: "rgb(227 232 238)",
                                    }}
                                >
                                    <span style={{ color: "rgba(14, 98, 69, 1)" }}>
                                        <svg
                                            aria-hidden='true'
                                            className='
                                                SVGInline-svg SVGInline--cleaned-svg
                                                SVG-svg
                                                Icon-svg Icon--clock-svg Icon-color-svg
                                                Icon-color--gray500-svg
                                            '
                                            height='12'
                                            width='12'
                                            viewBox='0 0 16 16'
                                            xmlns='http://www.w3.org/2000/svg'
                                            style={{ fill: "rgb(105 115 134)" }}
                                        >
                                            <path
                                                d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-8.577V4a1 1 0 1 0-2 0v4a1 1 0 0 0 .517.876l2.581 1.49a1 1 0 0 0 1-1.732z'
                                                fillRule='evenodd'
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className='booking-status fs-14 inline-block'
                                        style={{ paddingLeft: "4px" }}
                                    >
                                        Phê duyệt
                                    </span>
                                </div>
                            )}
                            {bookingRowData.refund === true && (
                                <div
                                    style={{
                                        backgroundColor: "rgb(255, 56, 92)",
                                        padding: "1px 6px",
                                        borderRadius: "4px",
                                        width: "90px",
                                    }}
                                    className='normal-flex'
                                >
                                    <span className='inline-block mr-5'>
                                        <svg
                                            aria-hidden='true'
                                            height='12px'
                                            width='12px'
                                            viewBox='0 0 16 16'
                                            xmlns='http://www.w3.org/2000/svg'
                                            style={{ fill: "#fff" }}
                                        >
                                            <path
                                                d='M10.5 5a5 5 0 0 1 0 10 1 1 0 0 1 0-2 3 3 0 0 0 0-6l-6.586-.007L6.45 9.528a1 1 0 0 1-1.414 1.414L.793 6.7a.997.997 0 0 1 0-1.414l4.243-4.243A1 1 0 0 1 6.45 2.457L3.914 4.993z'
                                                fillRule='evenodd'
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className='booking-status fs-14 inline-block'
                                        style={{
                                            paddingLeft: "4px",
                                            color: "white",
                                        }}
                                    >
                                        Đã hủy
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </td>
                <td>
                    <span>{bookingRowData.bookingDate}</span>
                </td>
                <td className='listings__td-text' data-column='BEDROOM'>
                    <span>{bookingRowData.checkinDate}</span>
                </td>
                <td className='listings__td-text' data-column='BED'>
                    <span>{bookingRowData.checkoutDate}</span>
                </td>
                <td className='listings__td-text' data-column='BED'>
                    <Image
                        src={getImage(bookingRowData.customerAvatar)}
                        size='40px'
                        className='of-c rounded-border'
                    />
                    <span> {bookingRowData.customerName} </span>
                </td>
                <td className='listings__td-text' data-column='BATHROOM'>
                    <div>
                        <MyNumberForMat
                            price={bookingRowData.siteFee}
                            isPrefix
                            removeStayType
                            currency={bookingRowData.roomCurrency}
                        />
                    </div>
                </td>
                <td className='listings__td-text'>
                    <div>
                        <MyNumberForMat
                            price={bookingRowData.pricePerDay}
                            isPrefix
                            removeStayType
                            currency={bookingRowData.roomCurrency}
                        />
                    </div>
                </td>
                <td>{bookingRowData.numberOfDays}</td>
                <td className='listings__td-text' data-column='LASTMODIFIED'>
                    <div>
                        <MyNumberForMat
                            price={
                                bookingRowData.numberOfDays * bookingRowData.pricePerDay +
                                bookingRowData.siteFee
                            }
                            isPrefix
                            removeStayType
                            currency={bookingRowData.roomCurrency}
                            priceFontSize='16px'
                            stayTypeFontSize='16px'
                            priceFontWeight='500'
                            color='rgb(255, 56, 92)'
                        />
                    </div>
                </td>
                <td>
                    <MyNumberForMat
                        price={bookingRowData.refundPaid}
                        isPrefix
                        removeStayType
                        currency={bookingRowData.roomCurrency}
                        priceFontSize='16px'
                        stayTypeFontSize='16px'
                        priceFontWeight='500'
                    />
                </td>
                <td>
                    {bookingRowData.complete === false &&
                        bookingRowData.refund === false &&
                        today <= checkinDate &&
                        !bookingRowData.cancelDate && (
                            <button
                                className='listings__complete-room-making listings__td-text'
                                data-booking-id={bookingRowData.bookingId}
                                onClick={dropoutBooking}
                            >
                                Hủy bỏ
                            </button>
                        )}
                    {bookingRowData.complete === false &&
                        bookingRowData.refund === false &&
                        today <= checkinDate && (
                            <button
                                className='listings__complete-room-making listings__td-text'
                                data-booking-id={bookingRowData.bookingId}
                                onClick={apprvBooking}
                            >
                                Phê duyệt
                            </button>
                        )}
                    {bookingRowData.complete === true && bookingRowData.refund === false && (
                        <button
                            className='listings__complete-room-making listings__td-text'
                            data-booking-id={bookingRowData.bookingId}
                            onClick={viewBooking}
                        >
                            Xem đơn đặt phòng
                        </button>
                    )}
                </td>
            </tr>
        </>
    );
};

export default BookingDataRow;
