import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Div, Image } from "../../globalStyle";
import { callToast, getImage } from "../../helpers";
import { IBookedRoom, IRatingLabel } from "../../types/user/type_User";
import { MyNumberForMat } from "../utils";
import { addClickEventForLoveButton } from "../home/script/add_to_wishlists";
import { userState } from "../../features/user/userSlice";
import initComp from "./script";
import Toast from "../notify/Toast";

import $ from "jquery";
import { bookingState, cancelUserBooking, makeReview } from "../../features/booking/bookingSlice";

interface IBookedRoomProps {
    booking: IBookedRoom;
    ratingLabels: IRatingLabel[];
}

let cleanlinessRating2 = 0,
    contactRating2 = 0,
    checkinRating2 = 0,
    accuracyRating2 = 0,
    locationRating2 = 0,
    valueRating2 = 0;

const BookedRoom: FC<IBookedRoomProps> = ({ booking, ratingLabels }) => {
    const { wishlistsIDs, user, wishlistsIDsFetching } = useSelector(userState);
    const { cancelledBookingId } = useSelector(bookingState);
    const [ratingComment, setRatingComment] = useState(booking.bookingReview);
    const [ratingComment2, setRatingComment2] = useState("");
    const [cleanlinessRating, setCleanlinessRating] = useState(0);
    const [accuracyRating, setAccuracyRating] = useState(0);
    const [contactRating, setContactRating] = useState(0);
    const [locationRating, setLocationRating] = useState(0);
    const [checkinRating, setCheckinRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);

    const dispatch = useDispatch();

    function reviewSubmit(event: any) {
        const bookingId = $(event.currentTarget).data("booking-id");

        if (!ratingComment2) {
            callToast("warning", "Vui lòng để lại bình luận!");
            return;
        }

        dispatch(
            makeReview({
                bookingId,
                cleanlinessRating: cleanlinessRating2,
                contactRating: contactRating2,
                checkinRating: checkinRating2,
                accuracyRating: accuracyRating2,
                locationRating: locationRating2,
                valueRating: valueRating2,
                ratingComment: ratingComment2,
            })
        );
    }

    function handleLike() {
        $(".ratingStar").each(function () {
            $(this).on("click", function () {
                const starValue = $(this).data("star-value") * 1;
                const ratingName = $(this).parent().parent().parent().data("rating-name");
                let isHavingGreaterRating = false;

                if ($(this).hasClass("selected")) {
                    $(this)
                        .parent()
                        .siblings()
                        .each(function () {
                            if (
                                $(this).children(".ratingStar").data("star-value") * 1 >
                                    starValue &&
                                $(this).children(".ratingStar").hasClass("selected")
                            ) {
                                $(this).children(".ratingStar").removeClass("selected");
                                isHavingGreaterRating = true;
                            }
                        });

                    if (!isHavingGreaterRating) {
                        $(this)
                            .parent()
                            .siblings()
                            .each(function () {
                                if (
                                    $(this).children(".ratingStar").data("star-value") * 1 <
                                    starValue
                                ) {
                                    $(this).children(".ratingStar").removeClass("selected");
                                }
                            });

                        $(this).removeClass("selected");
                    } else {
                        switch (ratingName) {
                            case "Mức độ sạch sẽ": {
                                setCleanlinessRating(starValue);
                                cleanlinessRating2 = starValue;
                                break;
                            }
                            case "Độ chính xác": {
                                setAccuracyRating(starValue);
                                accuracyRating2 = starValue;
                                break;
                            }
                            case "Liên lạc": {
                                setContactRating(starValue);
                                contactRating2 = starValue;
                                break;
                            }
                            case "Vị trí": {
                                setLocationRating(starValue);
                                locationRating2 = starValue;
                                break;
                            }
                            case "Nhận phòng": {
                                setCheckinRating(starValue);
                                checkinRating2 = starValue;
                                break;
                            }
                            case "Giá trị": {
                                setValueRating(starValue);
                                valueRating2 = starValue;
                                break;
                            }
                        }
                    }
                } else {
                    $(this)
                        .parent()
                        .siblings()
                        .each(function () {
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= starValue)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                    $(this).addClass("selected");

                    switch (ratingName) {
                        case "Mức độ sạch sẽ": {
                            setCleanlinessRating(starValue);
                            cleanlinessRating2 = starValue;
                            break;
                        }
                        case "Độ chính xác": {
                            setAccuracyRating(starValue);
                            accuracyRating2 = starValue;
                            break;
                        }
                        case "Liên lạc": {
                            setContactRating(starValue);
                            contactRating2 = starValue;
                            break;
                        }
                        case "Vị trí": {
                            setLocationRating(starValue);
                            locationRating2 = starValue;
                            break;
                        }
                        case "Nhận phòng": {
                            setCheckinRating(starValue);
                            checkinRating2 = starValue;
                            break;
                        }
                        case "Giá trị": {
                            setValueRating(starValue);
                            valueRating2 = starValue;
                            break;
                        }
                    }
                }
            });
        });
    }

    function handleSetRatingComment(event: any) {
        setRatingComment2(event.currentTarget.value);
    }

    function displayEditThumbnailBox(self: JQuery<HTMLElement>) {
        //find matching booking id and open up review section.
        console.log(self.data("booking-id"));
        $(".chooseRoomThumbnail").each(function () {
            if (parseInt($(this).data("booking-id")) === parseInt(self.data("booking-id"))) {
                $(this).addClass("active");
                $("#user-bookings__mainContainer").addClass("unactive");
            }
        });
        // console.log(booking.bookingReview);
        // console.log(ratingComment);
        if (self.data("rating-comment")) {
        } else {
            handleLike();
        }

        $(".ratingContainer", ".chooseRoomThumbnail.active").each(function () {
            const cleanliness = parseInt($(this).data("rating-cleanliness"));
            const contact = parseInt($(this).data("rating-contact"));
            const checkin = parseInt($(this).data("rating-checkin"));
            const accuracy = parseInt($(this).data("rating-accuracy"));
            const location = parseInt($(this).data("rating-location"));
            const value = parseInt($(this).data("rating-value"));

            setCleanlinessRating(cleanliness);
            setContactRating(contact);
            setCheckinRating(checkin);
            setAccuracyRating(accuracy);
            setLocationRating(location);
            setValueRating(value);

            $(".ratingStarContainer").each(function () {
                const children = $(this).children();
                const label = $(this).data("label");

                switch (label) {
                    case "Mức độ sạch sẽ": {
                        children.each(function () {
                            console.log();
                            const svg = $(this).children("svg");
                            if (
                                $(this).children(".ratingStar").data("star-value") * 1 <=
                                cleanliness
                            ) {
                                $(this).children(".ratingStar").addClass("selected");
                            }
                        });
                        break;
                    }
                    case "Độ chính xác": {
                        children.each(function () {
                            const svg = $(this).children("svg");
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= accuracy)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                    case "Liên lạc": {
                        children.each(function () {
                            const svg = $(this).children("svg");
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= contact)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                    case "Vị trí": {
                        children.each(function () {
                            const svg = $(this).children("svg");
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= location)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                    case "Nhận phòng": {
                        children.each(function () {
                            const svg = $(this).children("svg");
                            if ($(this).children(".ratingStar").data("star-value") * 1 <= checkin)
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                    case "Giá trị": {
                        children.each(function () {
                            const svg = $(this).children("svg");
                            if (
                                $(this).children(".ratingStar").data("star-value") * 1 <=
                                valueRating
                            )
                                $(this).children(".ratingStar").addClass("selected");
                        });
                        break;
                    }
                }
            });
        });
    }

    useEffect(() => {
        // initComp(
        //     setCleanlinessRating,
        //     setAccuracyRating,
        //     setContactRating,
        //     setLocationRating,
        //     setCheckinRating,
        //     setValueRating,
        //     setRatingComment,
        //     ratingComment
        // );
    }, []);

    function userCancelBooking(event: any) {
        console.log($(event.currentTarget).data("booking-id"));
        dispatch(cancelUserBooking($(event.currentTarget).data("booking-id")));
    }
    useEffect(() => {
        if (!wishlistsIDsFetching) addClickEventForLoveButton(wishlistsIDs, user);
    }, [wishlistsIDsFetching, user]);

    function hideEditThumbnailBox() {
        $(".chooseRoomThumbnail").removeClass("active");
        $("#user-bookings__mainContainer").removeClass("unactive");
    }

    const today = new Date();
    const checkinDate = new Date(booking.checkinDate);

    return (
        <>
            {booking && (
                <>
                    <div className='user-bookings__booking-box'>
                        <div className='box-padding'>
                            <Div className='flex-space' padding='0 0 10px 0'>
                                <div className='normal-flex'>
                                    <div>
                                        <button
                                            className='user-bookings__add-to-fav-btn room__likeBtn'
                                            data-room-id={booking.roomId}
                                        >
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                aria-hidden='true'
                                                focusable='false'
                                                role='presentation'
                                                viewBox='0 0 32 32'
                                                style={{
                                                    display: "block",
                                                    fill: "none",
                                                    height: "16px",
                                                    width: "16px",
                                                    stroke: "currentcolor",
                                                    strokeWidth: 2,
                                                    overflow: "visible",
                                                }}
                                                className='heartSvg'
                                            >
                                                <path d='m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z'></path>
                                            </svg>
                                            <span
                                                style={{ marginLeft: "5px" }}
                                                className='inline-block'
                                            >
                                                Yêu thích
                                            </span>
                                        </button>
                                    </div>
                                    <Div className='normal-flex' margin='0 0 0 10px'>
                                        <Div width='40px' height='40px'>
                                            <img
                                                src={getImage(booking.hostAvatar)}
                                                alt=''
                                                className='w100-h100 rounded-border of-c'
                                            />
                                        </Div>
                                        <div className='user-bookings__customer-name'>
                                            {booking.hostName}
                                        </div>
                                    </Div>
                                </div>
                                <div>
                                    {booking.complete === true && booking.refund === false && (
                                        <div
                                            style={{
                                                padding: "1px 6px",
                                                borderRadius: "4px",
                                                backgroundColor: "rgb(203 244 201)",
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
                                            <span className='booking-status'> Hoàn tất </span>
                                        </div>
                                    )}{" "}
                                    {booking.complete === false && booking.refund === false && (
                                        <div
                                            style={{
                                                padding: "1px 6px",
                                                borderRadius: "4px",
                                                backgroundColor: "#ffcc00",
                                            }}
                                        >
                                            <span style={{ color: "white" }}>
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
                                                    style={{ fill: "#222" }}
                                                >
                                                    <path
                                                        d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-8.577V4a1 1 0 1 0-2 0v4a1 1 0 0 0 .517.876l2.581 1.49a1 1 0 0 0 1-1.732z'
                                                        fillRule='evenodd'
                                                    ></path>
                                                </svg>
                                            </span>
                                            <span
                                                className='booking-status'
                                                style={{ color: "#222" }}
                                            >
                                                {" "}
                                                {today.getTime() >= checkinDate.getTime()
                                                    ? "Quá thời hạn phê duyệt"
                                                    : " Đang phê duyệt"}
                                            </span>
                                        </div>
                                    )}
                                    {booking.refund === true && (
                                        <div
                                            style={{
                                                backgroundColor: "#dc3545",
                                                padding: "1px 6px",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            <span style={{ color: "rgba(14, 98, 69, 1)" }}>
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
                                                    style={{ fill: "white" }}
                                                >
                                                    <path
                                                        d='M10.5 5a5 5 0 0 1 0 10 1 1 0 0 1 0-2 3 3 0 0 0 0-6l-6.586-.007L6.45 9.528a1 1 0 0 1-1.414 1.414L.793 6.7a.997.997 0 0 1 0-1.414l4.243-4.243A1 1 0 0 1 6.45 2.457L3.914 4.993z'
                                                        fillRule='evenodd'
                                                    ></path>
                                                </svg>
                                            </span>
                                            <span
                                                className='booking-status fs-14'
                                                style={{ color: "white" }}
                                            >
                                                {" "}
                                                Đã hủy
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Div>
                            <div className='normal-flex user-bookings__booking-body'>
                                <Div width='80px' height='80px'>
                                    <img
                                        src={getImage(booking.roomThumbnail)}
                                        className='w100-h100'
                                        style={{ borderRadius: "8px" }}
                                        alt={booking.roomThumbnail}
                                    />
                                </Div>
                                <Div className='normal-flex' width='100%'>
                                    <div
                                        style={{ paddingLeft: "12px", maxWidth: "65%" }}
                                        className='f1'
                                    >
                                        <div className='user-bookings__room-name'>
                                            {booking.roomName}
                                        </div>
                                        <div>
                                            <div style={{ color: "#717171" }} className='fs-14'>
                                                {booking.privacyType} tại
                                                {booking.roomCategory}
                                            </div>
                                        </div>
                                        <div>
                                            <span>Ngày đặt: </span>
                                            <span>{booking.bookingDate}</span>
                                        </div>
                                        <div>
                                            <span>Từ ngày: </span>
                                            <span>{booking.checkinDate}</span>
                                            <span> · </span>
                                            <span>Đến ngày: </span>
                                            <span>{booking.checkoutDate}</span>
                                        </div>
                                    </div>
                                    <div
                                        style={{ maxWidth: "35%", alignItems: "flex-end" }}
                                        className='col-flex f1'
                                    >
                                        <Div width='100%' className='flex'>
                                            <div className='fw-600 fs-16'>Giá thuê phòng:</div>
                                            <div className='normal-flex f1 jc-fe'>
                                                <span
                                                    className='
                                                            user-bookings__currency-symbol
                                                            fw-600
                                                        '
                                                >
                                                    {booking.currency}
                                                </span>
                                                <span>
                                                    <span className='fw-600'>
                                                        <MyNumberForMat
                                                            currency={booking.currency}
                                                            price={booking.pricePerDay}
                                                            stayType={
                                                                booking.priceType == "PER_NIGHT"
                                                                    ? "đêm"
                                                                    : "tuần"
                                                            }
                                                            priceFontSize='16px'
                                                            stayTypeFontSize='16px'
                                                        />
                                                    </span>
                                                </span>
                                            </div>
                                        </Div>
                                        <Div width='100%' className='flex'>
                                            <div className='fw-600 fs-16'>Phí dịch vụ:</div>
                                            <div className='normal-flex f1 jc-fe'>
                                                <span
                                                    className='
                                                            user-bookings__currency-symbol
                                                            fw-600
                                                        '
                                                >
                                                    {booking.currency}
                                                </span>
                                                <span className='fw-600'>
                                                    <MyNumberForMat
                                                        price={booking.siteFee}
                                                        currency={booking.currency}
                                                        stayType={
                                                            booking.priceType == "PER_NIGHT"
                                                                ? "đêm"
                                                                : "tuần"
                                                        }
                                                    />
                                                </span>
                                            </div>
                                        </Div>
                                        <Div width='100%' className='flex'>
                                            <div className='fw-600 fs-16'>Thời gian ở:</div>
                                            <div className='normal-flex fw-600 jc-fe f1'>
                                                {booking.numberOfDays}
                                                <span style={{ marginLeft: "5px" }}>
                                                    {booking.priceType === "PER_NIGHT"
                                                        ? "đêm"
                                                        : "tuần"}
                                                </span>
                                            </div>
                                        </Div>
                                    </div>
                                </Div>
                            </div>
                        </div>
                        <div className='col-flex user-bookings__booking-footer'>
                            <div
                                style={{ alignSelf: "flex-end", marginBottom: "10px" }}
                                className='f1 flex'
                            >
                                <span className='fw-600 fs-16'>Tổng số tiền: </span>
                                <span className='inline-block' style={{ marginLeft: "10px" }}>
                                    <span style={{ color: "rgb(255, 56, 92)" }} className='fw-600'>
                                        <MyNumberForMat
                                            price={
                                                booking.pricePerDay * booking.numberOfDays +
                                                booking.siteFee
                                            }
                                            currency={booking.currency}
                                            removeStayType
                                            priceFontSize='20px'
                                            stayTypeFontSize='20px'
                                            isSuffix
                                        />
                                    </span>
                                </span>
                            </div>
                            <div className='normal-flex'>
                                <div className='flex jc-fe w-100'>
                                    <Link to={`/room/${booking.roomId}`}>
                                        <div className='mr-10'>
                                            <button className='button bg-red'>Xem phòng</button>
                                        </div>
                                    </Link>
                                    <Link to={"/"}>
                                        <div className='mr-10'>
                                            <button className='button bg-normal'>
                                                Tiếp tục đặt phòng
                                            </button>
                                        </div>
                                    </Link>
                                    {booking.refund === false && (
                                        <div className='mr-10'>
                                            {booking.complete && (
                                                <button
                                                    className='button bg-normal'
                                                    data-booking-id={booking.bookingId}
                                                    onClick={e =>
                                                        displayEditThumbnailBox($(e.currentTarget))
                                                    }
                                                    data-rating-comment={booking.bookingReview}
                                                >
                                                    {booking.bookingReview !== null
                                                        ? "Xem đánh giá"
                                                        : "Đánh giá"}
                                                </button>
                                            )}

                                            <div
                                                className='chooseRoomThumbnail'
                                                data-booking-id={booking.bookingId}
                                            >
                                                <div className='flex jc-center h-100'>
                                                    <div className='innerWrapper'>
                                                        <div id='boxHeader' className='normal-flex'>
                                                            <div
                                                                onClick={() =>
                                                                    hideEditThumbnailBox()
                                                                }
                                                            >
                                                                <Image
                                                                    src={getImage(
                                                                        "/svg/close2.svg"
                                                                    )}
                                                                    size='16px'
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </div>
                                                            <div className='manage-photos__title f1 flex jc-center'>
                                                                Đánh giá phòng
                                                            </div>
                                                        </div>
                                                        <div id='boxBody'>
                                                            <div className='col-flex'>
                                                                <div className='normal-flex'>
                                                                    <div>
                                                                        <Image
                                                                            src={getImage(
                                                                                booking.roomThumbnail
                                                                            )}
                                                                            size='50px'
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <div
                                                                            className='
                                                                                user-bookings__room-name
                                                                            '
                                                                        >
                                                                            {booking.roomName}
                                                                        </div>
                                                                        <div>
                                                                            <div className='fs-14 717171'>
                                                                                {
                                                                                    booking.privacyType
                                                                                }{" "}
                                                                                tại <span> </span>
                                                                                {
                                                                                    booking.roomCategory
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                data-rating-cleanliness={
                                                                    booking.reviewRating != null
                                                                        ? booking.reviewRating
                                                                              .cleanliness
                                                                        : 0
                                                                }
                                                                data-rating-contact={
                                                                    booking.reviewRating != null
                                                                        ? booking.reviewRating
                                                                              .contact
                                                                        : 0
                                                                }
                                                                data-rating-checkin={
                                                                    booking.reviewRating != null
                                                                        ? booking.reviewRating
                                                                              .checkin
                                                                        : 0
                                                                }
                                                                data-rating-accuracy={
                                                                    booking.reviewRating != null
                                                                        ? booking.reviewRating
                                                                              .accuracy
                                                                        : 0
                                                                }
                                                                data-rating-location={
                                                                    booking.reviewRating != null
                                                                        ? booking.reviewRating
                                                                              .location
                                                                        : 0
                                                                }
                                                                data-rating-value={
                                                                    booking.reviewRating != null
                                                                        ? booking.reviewRating.value
                                                                        : 0
                                                                }
                                                                className='ratingContainer'
                                                            >
                                                                {ratingLabels.map(
                                                                    (rating, index) => (
                                                                        <div
                                                                            className='normal-flex jc-sb'
                                                                            data-rating-name={
                                                                                rating.label
                                                                            }
                                                                            key={rating.label}
                                                                        >
                                                                            <label>
                                                                                {rating.label}
                                                                            </label>
                                                                            <div
                                                                                className='
                                                                                normal-flex
                                                                                ratingStarContainer
                                                                            '
                                                                                data-label={
                                                                                    rating.label
                                                                                }
                                                                            >
                                                                                {rating.stars.map(
                                                                                    (star, idx) => (
                                                                                        <div>
                                                                                            <svg
                                                                                                enableBackground='new 0 0 15 15'
                                                                                                viewBox='0 0 15 15'
                                                                                                x='0'
                                                                                                y='0'
                                                                                                data-star-value={
                                                                                                    idx +
                                                                                                    1
                                                                                                }
                                                                                                className='
                                                                                            ratingStar
                                                                                        '
                                                                                                key={
                                                                                                    star +
                                                                                                    idx +
                                                                                                    1
                                                                                                }
                                                                                            >
                                                                                                <polygon
                                                                                                    points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                                                                                                    strokeLinecap='round'
                                                                                                    strokeLinejoin='round'
                                                                                                    strokeMiterlimit='10'
                                                                                                ></polygon>
                                                                                            </svg>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div>
                                                                    <label className='form-label'>
                                                                        Bình luận:
                                                                    </label>
                                                                    {ratingComment !== null ? (
                                                                        <input
                                                                            type='text'
                                                                            id='ratingComment'
                                                                            name='ratingComment'
                                                                            value={ratingComment}
                                                                            readOnly
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type='text'
                                                                            id='ratingComment'
                                                                            name='ratingComment'
                                                                            value={ratingComment2}
                                                                            onChange={
                                                                                handleSetRatingComment
                                                                            }
                                                                            disabled={
                                                                                ratingComment !==
                                                                                null
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            placeholder='Để lại bình luận ở đây!'
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id='boxFooter' className='flex-space'>
                                                            <div>
                                                                <button
                                                                    className='
                                                                        manage-photos__cancel-btn
                                                                    '
                                                                    onClick={() =>
                                                                        hideEditThumbnailBox()
                                                                    }
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    className='
                                                                        manage-photos__save-edit-btn
                                                                    '
                                                                    data-booking-id={
                                                                        booking.bookingId
                                                                    }
                                                                    onClick={reviewSubmit}
                                                                    disabled={
                                                                        booking.bookingReview !==
                                                                        null
                                                                    }
                                                                >
                                                                    Đánh giá
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type='hidden'
                                        name=''
                                        value={booking.bookingDate}
                                        className='bookingDate'
                                        data-is-cancel={booking.refund}
                                        data-is-complete={booking.complete}
                                    />

                                    {booking.refund === false &&
                                        booking.complete === false &&
                                        today.getTime() <= checkinDate.getTime() && (
                                            <div className='cancelBookingBtn mr-10'>
                                                <button
                                                    className='button bg-normal'
                                                    onClick={userCancelBooking}
                                                    data-booking-id={booking.bookingId}
                                                >
                                                    Hủy đặt phòng
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default BookedRoom;
