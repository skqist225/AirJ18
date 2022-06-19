import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import BookedRoom from "../components/booked_rooms/BookedRooms";
import Header from "../components/Header";
import {
    fetchBookedRooms,
    fetchWishlistsIDsOfCurrentUser,
    userState,
} from "../features/user/userSlice";
import { Image } from "../globalStyle";
import { callToast, getImage } from "../helpers";
import $ from "jquery";

import "./css/booked_rooms.css";
import { bookingState } from "../features/booking/bookingSlice";
import Toast from "../components/notify/Toast";

interface IBookedRoomsPageProps {}

const BookedRoomsPage: FC<IBookedRoomsPageProps> = () => {
    const dispatch = useDispatch();
    const { search } = useLocation();
    const { bookedRooms, ratingLabels } = useSelector(userState);
    const { cancelBookingSuccess, createReviewSuccess, cancelledBookingId } =
        useSelector(bookingState);

    useEffect(() => {
        let query = "";
        if (search!.includes("?")) {
            query = search!.split("=").pop()!;
        }

        dispatch(fetchBookedRooms({ query }));
        dispatch(fetchWishlistsIDsOfCurrentUser());
    }, []);

    function handleResetQuery() {
        $("#user-bookings__search-input").val("");
        dispatch(fetchBookedRooms({ query: "" }));
        dispatch(fetchWishlistsIDsOfCurrentUser());
    }

    function filterBookings() {
        const searchValue = $("#user-bookings__search-input").val()!.toString();
        dispatch(fetchBookedRooms({ query: searchValue }));
    }

    useEffect(() => {
        if (cancelBookingSuccess) {
            callToast("success", "Hủy đặt phòng thành công");
            $(`.button[data-booking-id="${cancelledBookingId}"]`).css("display", "none");
            $(`.button[data-booking-id="${cancelledBookingId}"]`).remove();
            $(`.button[data-booking-id="${cancelledBookingId}"]`).empty();
        }
    }, [cancelBookingSuccess]);

    useEffect(() => {
        if (createReviewSuccess) callToast("success", "Đánh giá phòng thành công");
    }, [createReviewSuccess]);

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            <div
                style={{ minHeight: "100vh" }}
                className='p-relative'
                id='user-bookings__mainContainer'
            >
                <div>
                    <div id='user-bookings__container'>
                        <div style={{ textAlign: "center" }}>
                            {/* <span
                                style={{color: 'green'}}
                                th:if="${cancelMessage == 'Hủy đặt phòng thành công'}"
                            >
                                [[${cancelMessage}]]
                            </span>
                            <span
                                style='color: red'
                                th:if="${cancelMessage == 'Hủy đặt phòng thất bại'}"
                            >
                                [[${cancelMessage}]]
                            </span> */}
                        </div>
                        <div className='normal-flex f1' id='user-bookings__search-container'>
                            <div
                                style={{ cursor: "pointer", marginRight: "10px" }}
                                onClick={filterBookings}
                            >
                                <Image src={getImage("/svg/search.svg")} size='20px' />
                            </div>
                            <input
                                type='text'
                                className='w-100'
                                placeholder='Tìm kiếm theo tên phòng, tên chủ nhà'
                                id='user-bookings__search-input'
                            />
                            <div>
                                {/* <Link to={'/user/bookings'}> */}
                                <button
                                    style={{ width: "100px" }}
                                    className='fs-14 fw-600 transparent__btn'
                                    onClick={handleResetQuery}
                                >
                                    Xóa tìm kiếm
                                </button>
                                {/* </Link> */}
                            </div>
                        </div>
                        {bookedRooms.map(bookedRoom => (
                            <BookedRoom
                                booking={bookedRoom}
                                ratingLabels={ratingLabels}
                                key={bookedRoom.bookingId}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Toast />
        </>
    );
};

export default BookedRoomsPage;
