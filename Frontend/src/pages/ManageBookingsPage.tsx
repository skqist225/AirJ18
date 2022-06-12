import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { BookingsTable } from "../components/booking";
import Header from "../components/Header";
import { FilterFooter, Pagination } from "../components/utils";
import {
    bookingState,
    clearAllFetchData,
    fetchUserBookings,
    setBookingDate,
    setBookingDateMonth,
    setBookingDateYear,
    setPage,
    setQuery,
    setTotalFee,
} from "../features/booking/bookingSlice";
import { Div, Image } from "../globalStyle";
import { getImage, seperateNumber } from "../helpers";
import { RootState } from "../store";

import "./css/manage_booking_page.css";
import "../components/hosting/listings/css/filter_by_line.css";
import "../components/hosting/listings/css/filter_footer.css";
import { FilterButton } from "../components/hosting/listings/components";
import $ from "jquery";
import { Col, Slider } from "antd";
import { sep } from "node:path/win32";

interface IManageBookingPageProps {}

const ManageBookingPage: FC<IManageBookingPageProps> = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const [query, setLocalQuery] = useState("");

    const { bookingsOfCurrentUserRooms, totalElements, fetchData, totalPages } =
        useSelector(bookingState);

    useEffect(() => {
        dispatch(fetchUserBookings({ ...fetchData, page: parseInt(params.page!) }));
        dispatch(setPage(parseInt(params.page!)));
    }, [params.page]);

    function handleFindBookingByRoomIdAndName(event: any) {
        setLocalQuery(event.currentTarget.value);
        dispatch(
            fetchUserBookings({
                ...fetchData,
                page: parseInt(params.page!),
                query: event.currentTarget.value,
            })
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
                        dispatch(clearAllFetchData({}));
                        dispatch(fetchUserBookings({ page: fetchData.page }));
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

    function handleBookingDateChange(event: any) {
        const { value } = event.currentTarget;
        enableDeleteButton(value, "bookingDate");
        dispatch(setBookingDate(value));
    }

    const onChange = (value: number) => {
        if (isNaN(value)) {
            return;
        }

        enableDeleteButton(value.toString(), "totalFee");
        dispatch(setTotalFee(value));
    };

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
                                    value={query}
                                    onChange={handleFindBookingByRoomIdAndName}
                                />
                            </div>
                        </div>
                        <FilterButton
                            dataDropDown='listings__filter-bookingDate'
                            title='Ngày đặt phòng'
                            width='200px'
                            height='170px'
                            content={
                                <>
                                    <div className='listings__filter-wrapper'>
                                        <div className='filter-box'>
                                            <div className='normal-flex listings__filter-status-row h-100'>
                                                <input
                                                    type='date'
                                                    className='form-control'
                                                    id='bookingDateInput'
                                                    value={fetchData.bookingDate}
                                                    onChange={handleBookingDateChange}
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
                            dataDropDown='listings__filter-bookingStatus'
                            title='Trạng thái đặt phòng'
                            width='300px'
                            height='300px'
                            content={
                                <>
                                    <div className='listings__filter-wrapper'>
                                        <div style={{ padding: "24px" }} className='f1'>
                                            <div
                                                className='normal-flex listings__filter-status-row'
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <div
                                                    style={{ marginRight: "10px" }}
                                                    className='normal-flex'
                                                >
                                                    <input
                                                        type='checkbox'
                                                        className='isCompleteSelected'
                                                        value='0'
                                                    />
                                                </div>
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
                                            </div>
                                            <div
                                                className='normal-flex listings__filter-status-row'
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <div
                                                    style={{ marginRight: "10px" }}
                                                    className='normal-flex'
                                                >
                                                    <input
                                                        type='checkbox'
                                                        className='isCompleteSelected'
                                                        value='1'
                                                    />
                                                </div>
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
                                            </div>
                                            <div
                                                className='normal-flex listings__filter-status-row'
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <div
                                                    style={{ marginRight: "10px" }}
                                                    className='normal-flex'
                                                >
                                                    <input
                                                        type='checkbox'
                                                        className='isCompleteSelected'
                                                        value='2'
                                                    />
                                                </div>
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
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            footerOf='bookingStatus'
                        />
                        <FilterButton
                            dataDropDown='listings__filter-totalFee'
                            title='Tổng phí'
                            width='300px'
                            height='200px'
                            content={
                                <>
                                    <div className='listings__filter-wrapper'>
                                        <div className='filter-box overflow-hidden'>
                                            <div className='normal-flex listings__filter-others-row'>
                                                <Col span={24}>
                                                    <Slider
                                                        min={0}
                                                        max={10000000}
                                                        step={500000}
                                                        onChange={onChange}
                                                        tooltipVisible={false}
                                                        value={fetchData.totalFee!}
                                                    />
                                                </Col>
                                            </div>
                                            <div className='normal-flex listings__filter-others-row'>
                                                <input
                                                    type='text'
                                                    id='totalFeeInput'
                                                    value={seperateNumber(fetchData.totalFee!)}
                                                    className='form-control'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            footerOf='totalFee'
                        />
                        <FilterButton
                            dataDropDown='clearFilter'
                            title='Xóa toàn bộ bộ lọc'
                            width=''
                            height=''
                            content={<></>}
                            footerOf=''
                            haveBox={false}
                        />
                    </div>
                    <div className='f1'>
                        {bookingsOfCurrentUserRooms && (
                            <BookingsTable bookings={bookingsOfCurrentUserRooms} />
                        )}
                    </div>
                    <Pagination totalPages={totalPages} to='booking' />
                </div>
            </div>
        </>
    );
};

export default ManageBookingPage;
