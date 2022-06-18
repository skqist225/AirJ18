import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
    fetchUserOwnedRoom,
    roomState,
    setAmenities,
    setRoomInfo,
    setStatus,
} from "../../features/room/roomSlice";
import { getPageNumber } from "../../helpers";

import $ from "jquery";
import "./css/filter_footer.css";
import {
    bookingState,
    fetchUserBookings,
    setBookingDate,
    setBookingDateMonth,
    setBookingDateYear,
    setIsComplete,
    setTotalFee,
} from "../../features/booking/bookingSlice";
import { convertToObject } from "typescript";

interface IFilterFooterProps {
    footerOf: string;
}

const FilterFooter: FC<IFilterFooterProps> = ({ footerOf }) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const params = useParams();
    const { fetchData } = useSelector(bookingState);
    const { filterObject } = useSelector(roomState);

    function closeFilterBox(footerClass: string) {
        $(`#listings__filter-${footerClass}`).removeClass("active");
    }

    function setCurrentFilterTitle(className: string, title: string) {
        $(`.listings__filter--option.${className}`).text(title);
    }

    useEffect(() => {
        $(".applyBtn").each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    const dataModify = $(this).data("modify");

                    switch (dataModify) {
                        case "roomAndBedRoom": {
                            let bathRooms = 0;
                            let bedRooms = 0;
                            let beds = 0;

                            $(".listings__minus-btn").each(function () {
                                const dataEdit = $(this).data("edit");
                                const spanValue = $(this).siblings(`#${dataEdit}`).text();

                                if (dataEdit === "listings__bath-room-count")
                                    bathRooms = parseInt(spanValue);
                                else if (dataEdit === "listings__bed-room-count")
                                    bedRooms = parseInt(spanValue);
                                else beds = parseInt(spanValue);
                            });

                            dispatch(
                                fetchUserOwnedRoom({
                                    ...filterObject,
                                    page: parseInt(params.page!),
                                    bathRooms,
                                    bedRooms,
                                    beds,
                                })
                            );
                            break;
                        }
                        case "amenities": {
                            let amentitiesID: number[] = [];

                            $(".amenity").each(function () {
                                if ($(this).children("span").hasClass("ant-checkbox-checked")) {
                                    amentitiesID.push(
                                        parseInt($(this).children().children().val() as string)
                                    );
                                }
                            });

                            dispatch(
                                fetchUserOwnedRoom({
                                    ...filterObject,
                                    page: parseInt(params.page!),
                                    amenityIDs: amentitiesID.join(" "),
                                })
                            );

                            break;
                        }
                        case "status": {
                            let statuses: string[] = [];
                            $(".statusSelected").each(function () {
                                if ($(this).children("span").hasClass("ant-checkbox-checked")) {
                                    statuses.push($(this).children().children().val() as string);
                                }
                            });

                            dispatch(
                                fetchUserOwnedRoom({
                                    ...filterObject,
                                    page: getPageNumber(pathname),
                                    statuses: statuses.join(" "),
                                })
                            );
                            break;
                        }
                        case "findByMonthAndYear": {
                            const month = $("#bookingDateMonthInput").val()!.toString();
                            const year = $("#bookingDateYearInput").val()!.toString();
                            console.log(fetchData);
                            dispatch(
                                fetchUserBookings({
                                    ...fetchData,
                                    bookingDateMonth: month,
                                    bookingDateYear: year,
                                })
                            );
                            break;
                        }
                        case "bookingDate": {
                            const bookingDateInput = $("#bookingDateInput").val()!.toString();
                            dispatch(
                                fetchUserBookings({
                                    ...fetchData,
                                    bookingDate: bookingDateInput,
                                })
                            );
                            setCurrentFilterTitle("bookingDate", bookingDateInput);
                            break;
                        }
                        case "bookingStatus": {
                            const statuses = $("input.isCompleteSelected");
                            let isComplete: string[] = [];
                            statuses.each(function () {
                                if ($(this).prop("checked")) {
                                    isComplete.push($(this).val()!.toString());
                                }
                            });
                            dispatch(
                                fetchUserBookings({
                                    ...fetchData,
                                    isComplete: isComplete.join(","),
                                })
                            );

                            break;
                        }
                        case "totalFee": {
                            const totalFee = $("#totalFeeInput")
                                .val()!
                                .toString()
                                .replace(/,/g, "");
                            console.log(fetchData);
                            dispatch(
                                fetchUserBookings({
                                    ...fetchData,
                                    totalFee: parseInt(totalFee),
                                })
                            );
                            break;
                        }
                    }

                    closeFilterBox(dataModify);
                });
        });
    }, []);

    $(".deleteBtn").each(function () {
        $(this)
            .off("click")
            .on("click", function () {
                const dataModify = $(this).data("modify");

                switch (dataModify) {
                    case "roomAndBedRoom": {
                        let bathRooms = 0;
                        let bedRooms = 0;
                        let beds = 0;
                        const query = $("#listings__search-input").val()!.toString().trim();

                        $(".listings__minus-btn").each(function () {
                            const dataEdit = $(this).data("edit");
                            const spanValue = $(this).siblings(`#${dataEdit}`).text();

                            if (dataEdit === "listings__bath-room-count")
                                bathRooms = parseInt(spanValue);
                            else if (dataEdit === "listings__bed-room-count")
                                bedRooms = parseInt(spanValue);
                            else beds = parseInt(spanValue);
                        });

                        console.log(bathRooms);
                        console.log(bedRooms);
                        console.log(beds);

                        break;
                    }
                    case "amenities": {
                        let amentitiesID: number[] = [];

                        $(".amenity").each(function () {
                            if ($(this).children("span").hasClass("ant-checkbox-checked")) {
                                amentitiesID.push(
                                    parseInt($(this).children().children().val() as string)
                                );
                            }
                        });

                        break;
                    }
                    case "status": {
                        let statuses: string[] = [];
                        $(".statusSelected").each(function () {
                            if ($(this).children("span").hasClass("ant-checkbox-checked")) {
                                statuses.push($(this).children().children().val() as string);
                            }
                        });

                        break;
                    }
                    case "findByMonthAndYear": {
                        dispatch(setBookingDateMonth(""));
                        dispatch(setBookingDateYear(""));
                        break;
                    }
                    case "bookingDate": {
                        $("#bookingDateInput").val("");
                        $(".listings__filter--option.bookingDate").text("Ngày đặt phòng");
                        dispatch(setBookingDate(""));
                        break;
                    }
                    case "bookingStatus": {
                        dispatch(setIsComplete("0,1,2"));
                        break;
                    }
                    case "totalFee": {
                        dispatch(setTotalFee(0));
                        break;
                    }
                }

                $(this).attr("disabled", "true");
            });
    });

    return (
        <div className='filter--footer__container'>
            <div className='flex'>
                <div>
                    <button
                        className={"filter--footer__transparentBtn deleteBtn " + footerOf}
                        data-modify={footerOf}
                        disabled
                    >
                        Xóa
                    </button>
                </div>
                <div>
                    <button
                        className={"filter--footer__applyBtn applyBtn " + footerOf}
                        data-modify={footerOf}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterFooter;
