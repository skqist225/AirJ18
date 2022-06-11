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
    // $(document).click(function () {
    //     $("#totalFeeRangeInput").attr("max", 100000000);
    //     highlightCurrentPageNumber(pageNumber);
    //     let url = `${window.location.origin}/booking/listings/${pageNumber}`;

    //     $(".listings__table-header").each(function () {
    //         $(this).on("click", function () {
    //             const params = new URLSearchParams(window.location.search);
    //             const sortField = $(this).data("sort-field");
    //             const sortDir = params.get("sort_dir") === "asc" ? "desc" : "asc";

    //             url += `?sort_field=${sortField}&sort_dir=${sortDir}`;
    //             window.location.href = url;
    //         });
    //     });

    //     // $(".listings__filter-option").each(function () {
    //     //     $(this).click(function () {
    //     //         const self = $(this);
    //     //         $(".listings__filter-option").each(function () {
    //     //             if (!$(this).is(self))
    //     //                 $(this).siblings().filter(".active").removeClass("active");
    //     //         });

    //     //         const id = $(this).data("dropdown");
    //     //         const filterBox = $("#" + id);
    //     //         if (filterBox.hasClass("active")) filterBox.removeClass("active");
    //     //         else filterBox.addClass("active");
    //     //     });
    //     // });

    //     // $(".applyBtn").each(function () {
    //     //     $(this).click(function () {
    //     //         let redirectURL = `${window.location.origin}/booking/listings/${pageNumber}`;
    //     //         const dataModify = $(this).data("modify");

    //     //         switch (dataModify) {
    //     //             case "isComplete": {
    //     //                 const selectedStatus = $('input[class="isCompleteSelected"]:checked');
    //     //                 let statuses: string[] = [];
    //     //                 selectedStatus.each(function () {
    //     //                     statuses.push($(this).val() as string);
    //     //                 });
    //     //                 redirectURL += `?isComplete=${statuses.join(" ")}`;

    //     //                 break;
    //     //             }
    //     //             case "bookingDate": {
    //     //                 const bookingDateInput = $("#bookingDateInput").val();
    //     //                 if (bookingDateInput) redirectURL += `?bookingDate=${bookingDateInput}`;

    //     //                 break;
    //     //             }
    //     //             case "bookingDateByMonthAndYear": {
    //     //                 const month = $("#bookingDateMonthInput").val() as number;
    //     //                 const year = $("#bookingDateYearInput").val() as number;

    //     //                 if (!isNaN(month) && !isNaN(year)) {
    //     //                     redirectURL += `?booking_date_month=${month}&booking_date_year=${year}`;
    //     //                 } else {
    //     //                     alert("Tháng hoặc năm không hợp lệ!");
    //     //                 }
    //     //                 break;
    //     //             }
    //     //             case "totalFee": {
    //     //                 redirectURL += `?totalFee=${($("#textInput").val()! as string).replace(
    //     //                     /\./g,
    //     //                     ""
    //     //                 )}`;
    //     //                 break;
    //     //             }
    //     //         }

    //     //         window.location.href = redirectURL;
    //     //     });
    //     // });

    //     $(".deleteAllFilterOption").click(function () {
    //         window.location.href = `${window.location.origin}/booking/listings/1`;
    //     });

    //     $(".listings__link").each(function () {
    //         $(this).attr(
    //             "href",
    //             `${window.location.origin}/booking/listings/${$(this).data("page")}${
    //                 window.location.search
    //             }`
    //         );
    //     });
    // });

    function highlightCurrentPageNumber(pageNumber: number) {
        $(".pagination").children().filter(".active").removeClass("active");
        $(".pagination")
            .children()
            .each(function () {
                const pageNum = $(this).data("page");
                if (pageNum.toString() === pageNumber.toString()) {
                    $(this).addClass("active");
                    return false;
                }
            });
    }

    function filterBookingByInput() {
        const query = ($("#listings__search-input").val()! as string).trim();
        let url = window.location.href;
        const paramsMap: globalThis.Map<string, string> = new Map();
        if (url.includes("?")) {
            let params = new URLSearchParams(window.location.search);

            if (params.get("query")) {
                for (const key of Array.from(params.keys())) {
                    paramsMap.set(key, params.get(key)!);
                }

                let newURL = `${window.location.origin}/booking/listings/${pageNumber}?`;
                const mapLen = getMapSize(paramsMap);

                let count = 0;
                for (const [key, value] of Array.from(paramsMap.entries())) {
                    if (key === "query") newURL += `query=${query}`;
                    else newURL += `${key}=${value}`;
                    if (count <= mapLen - 2) newURL += "&";
                    count++;
                }
                window.location.href = newURL;
                return;
            } else url += `&query=${query}`;
        } else url += `?query=${query}`;

        window.location.href = url;
    }
    // function updateTextInput(val) {
    //     document.getElementById('textInput').value = seperateNumber(val);
    // }

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
        window.location.href = `${window.location.origin}/booking/${self.data("booking-id")}/view`;
    }

    function dropoutBooking(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(cancelBooking({ bookingid: $(event.currentTarget).data("booking-id") }));
    }

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
                                        backgroundColor: "rgb(227 232 238)",
                                        padding: "1px 6px",
                                        borderRadius: "4px",
                                        width: "90px",
                                    }}
                                    className='normal-flex'
                                >
                                    <span
                                        style={{
                                            color: "rgba(14, 98, 69, 1)",
                                            marginRight: "5px",
                                        }}
                                        className='inline-block'
                                    >
                                        <svg
                                            aria-hidden='true'
                                            className='
                                                SVGInline-svg SVGInline--cleaned-svg
                                                SVG-svg
                                                Icon-svg Icon--refund-svg Icon-color-svg
                                                Icon-color--gray500-svg
                                            '
                                            height='12'
                                            width='12'
                                            viewBox='0 0 16 16'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                d='M10.5 5a5 5 0 0 1 0 10 1 1 0 0 1 0-2 3 3 0 0 0 0-6l-6.586-.007L6.45 9.528a1 1 0 0 1-1.414 1.414L.793 6.7a.997.997 0 0 1 0-1.414l4.243-4.243A1 1 0 0 1 6.45 2.457L3.914 4.993z'
                                                fillRule='evenodd'
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className='booking-status fs-14 inline-block'
                                        style={{ paddingLeft: "4px" }}
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
                            priceFontSize='20px'
                            stayTypeFontSize='20px'
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
                        priceFontSize='20px'
                        stayTypeFontSize='20px'
                    />
                </td>
                <td>
                    {bookingRowData.complete === false &&
                        bookingRowData.refund === false &&
                        !bookingRowData.cancelDate && (
                            <button
                                className='listings__complete-room-making listings__td-text'
                                data-booking-id={bookingRowData.bookingId}
                                onClick={dropoutBooking}
                            >
                                Hủy bỏ
                            </button>
                        )}
                    {bookingRowData.complete === false && bookingRowData.refund === false && (
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
