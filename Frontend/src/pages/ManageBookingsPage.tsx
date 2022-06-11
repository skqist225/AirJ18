import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { BookingsTable } from "../components/booking";
import Header from "../components/Header";
import { FilterFooter, Pagination } from "../components/utils";
import {
    bookingState,
    fetchUserBookings,
    setBookingDateMonth,
    setBookingDateYear,
    setPage,
} from "../features/booking/bookingSlice";
import { Div, Image } from "../globalStyle";
import { getImage } from "../helpers";
import { RootState } from "../store";

import "./css/manage_booking_page.css";
import "../components/hosting/listings/css/filter_by_line.css";
import "../components/hosting/listings/css/filter_footer.css";
import { FilterButton } from "../components/hosting/listings/components";
import $ from "jquery";

interface IManageBookingPageProps {}

const ManageBookingPage: FC<IManageBookingPageProps> = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const { pathname } = useLocation();

    useEffect(() => {
        dispatch(fetchUserBookings({ page: parseInt(params.page!) }));
        dispatch(setPage(parseInt(params.page!)));
    }, [pathname]);

    const { bookingsOfCurrentUserRooms, totalElements, fetchData } = useSelector(bookingState);

    function handleFindBookingByRoomIdAndName(event: any) {
        dispatch(
            fetchUserBookings({ page: parseInt(params.page!), query: event.currentTarget.value })
        );
    }

    useEffect(() => {
        $(".listings__filter--option").each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    const self = $(this);
                    $(".listings__filter--option").each(function () {
                        if (!$(this).is(self))
                            $(this).siblings().filter(".active").removeClass("active");
                    });

                    const filterBox = $(`#${$(this).data("dropdown")}`);

                    filterBox.hasClass("active")
                        ? filterBox.removeClass("active")
                        : filterBox.addClass("active");

                    if ($(this).data("dropdown") === "clearFilter") {
                        // dispatch(fetchUserOwnedRoom({ pageNumber: getPageNumber(pathname) }));
                    }
                });
        });
    }, []);

    function enableDeleteButton(value: string, footerOf: string) {
        const deleteButton = $(`.deleteBtn.${footerOf}`);
        if (value) {
            deleteButton.removeAttr("disabled");
        } else {
            deleteButton.attr("disabled", "true");
        }
    }

    function handleMonthChange(event: any) {
        const { value } = event.currentTarget;
        enableDeleteButton(value, "findByMonthAndYear");
        dispatch(setBookingDateMonth(value));
    }

    function handleYearChange(event: any) {
        const { value } = event.currentTarget;
        enableDeleteButton(value, "findByMonthAndYear");
        dispatch(setBookingDateYear(value));
    }

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />

            <div id='booking--listings__mainContainer'>
                <div className='listings__container col-flex' style={{ height: "95vh" }}>
                    <div className='listings__header flex'>
                        <div className='listings__header-rooms-length'>
                            {totalElements} đơn đặt phòng
                        </div>
                    </div>
                    <div className='listings__filter-container'>
                        <div className='listings__search-room'>
                            <div className='listings__search-icon-container'>
                                <Image src={getImage("/svg/search.svg")} size='12px' />
                            </div>
                            <div className='f1' style={{ marginLeft: "10px" }}>
                                <input
                                    type='text'
                                    placeholder='Tìm kiếm lịch đặt phòng theo mã, tên phòng'
                                    id='listings__search-input'
                                    onChange={handleFindBookingByRoomIdAndName}
                                />
                            </div>
                        </div>
                        <FilterButton
                            dataDropDown='listings__filter-bookingDate'
                            title='Ngày đặt phòng'
                            width='200px'
                            height='200px'
                            content={
                                <>
                                    <div className='listings__filter-wrapper'>
                                        <div className='filter-box'>
                                            <div className='normal-flex listings__filter-status-row h-100'>
                                                <input
                                                    type='date'
                                                    className='form-control'
                                                    id='bookingDateInput'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            footerOf='bookingDate'
                        />
                        <FilterButton
                            dataDropDown='listings__filter-findByMonthAndYear'
                            title='Tìm kiếm theo tháng và năm'
                            width='200px'
                            height='300px'
                            content={
                                <>
                                    <Div className='filter-box' height='80%' padding='24px'>
                                        <div>
                                            <input
                                                type='text'
                                                placeholder='Tháng'
                                                className='form-control mb-5'
                                                id='bookingDateMonthInput'
                                                pattern='^[1-12]{1,2}$'
                                                minLength={1}
                                                maxLength={2}
                                                value={fetchData.bookingDateMonth}
                                                onChange={handleMonthChange}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type='text'
                                                placeholder='Năm'
                                                className='form-control'
                                                id='bookingDateYearInput'
                                                pattern='^[0-9]+'
                                                minLength={4}
                                                maxLength={4}
                                                value={fetchData.bookingDateYear}
                                                onChange={handleYearChange}
                                            />
                                        </div>
                                    </Div>
                                </>
                            }
                            footerOf='findByMonthAndYear'
                        />
                        <FilterButton
                            dataDropDown='listings__filter-status'
                            title='Trạng thái đặt phòng'
                            width='300px'
                            height='300px'
                            content={
                                <>
                                    <div className='listings__filter-wrapper'>
                                        <div style={{ padding: "24px" }} className='f1'>
                                            <div className='normal-flex listings__filter-status-row'>
                                                <input
                                                    type='checkbox'
                                                    className='isCompleteSelected'
                                                    value='1'
                                                />
                                                <div>Hoàn tất</div>
                                            </div>
                                            <div className='normal-flex listings__filter-status-row'>
                                                <input
                                                    type='checkbox'
                                                    className='isCompleteSelected'
                                                    value='0'
                                                />
                                                <div>Phê duyệt</div>
                                            </div>
                                            <div className='normal-flex listings__filter-status-row'>
                                                <input
                                                    type='checkbox'
                                                    className='isCompleteSelected'
                                                    value='2'
                                                />
                                                <div>Đã hủy</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            footerOf='status'
                        />
                        <div className='listings__filter'>
                            <button
                                className='listings__filter--option'
                                data-dropdown='listings__filter-others'
                            >
                                <span>Tổng phí</span>
                                <div className='listings__filter-img-container'>
                                    <Image src={getImage("/svg/dropdown.svg")} size='12px' />
                                </div>
                            </button>
                            <div id='listings__filter-others'>
                                <div className='listings__filter-wrapper'>
                                    <div className='filter-box overflow-hidden'>
                                        <div className='normal-flex listings__filter-others-row'>
                                            <input
                                                type='range'
                                                className='form-range form-control w-100'
                                                id='totalFeeRangeInput'
                                                min={0}
                                                // onchange='updateTextInput(this.value);'
                                                step='1000000'
                                            />
                                        </div>
                                        <div className='normal-flex listings__filter-others-row'>
                                            <input
                                                type='text'
                                                id='textInput'
                                                value=''
                                                className='form-control'
                                            />
                                        </div>
                                    </div>
                                    <FilterFooter footerOf='totalFee' />
                                </div>
                            </div>
                        </div>
                        <div className='listings__filter'>
                            <button
                                className='listings__filter--option deleteAllFilterOption'
                                data-dropdown='listings__filter-others'
                            >
                                <span>Xóa toàn bộ bộ lọc</span>
                            </button>
                        </div>
                    </div>
                    <div className='f1'>
                        {bookingsOfCurrentUserRooms && (
                            <BookingsTable bookings={bookingsOfCurrentUserRooms} />
                        )}
                    </div>
                    <Pagination totalPages={6} />
                </div>
            </div>
        </>
    );
};

export default ManageBookingPage;
