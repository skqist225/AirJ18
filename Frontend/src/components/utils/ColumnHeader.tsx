import { FC, useEffect, useState } from "react";

import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOwnedRoom, roomState } from "../../features/room/roomSlice";
import { useLocation, useParams } from "react-router-dom";

import "./css/column_header.css";
import { bookingState, fetchUserBookings } from "../../features/booking/bookingSlice";

interface IColumnHeaderProps {
    columnName: string;
    sortField: string;
    isSortableHeader?: boolean;
}

const ColumnHeader: FC<IColumnHeaderProps> = ({
    columnName,
    sortField,
    isSortableHeader = true,
}) => {
    const dispatch = useDispatch();
    const { page } = useParams();
    const { pathname } = useLocation();

    const [sortDir, setSortDir] = useState("ASC");
    const { fetchData } = useSelector(bookingState);
    const { filterObject } = useSelector(roomState);

    const searchParams = new URLSearchParams().get("SORTDIR");
    if (searchParams) searchParams === "ASC" ? setSortDir("DESC") : setSortDir("ASC");

    function sortData(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const sortField: string = $(event.currentTarget).data("sort-field");

        console.log(sortField);
        console.log(sortDir);
        if (pathname.includes("/booking/listings")) {
            dispatch(
                fetchUserBookings({
                    ...fetchData,
                    sortField,
                    sortDir,
                })
            );
        } else {
            dispatch(
                fetchUserOwnedRoom({ ...filterObject, page: parseInt(page!), sortField, sortDir })
            );
        }
        if (sortDir === "ASC") {
            const upperSelft = $(".upper." + sortField);
            $(".sort").filter(".active").removeClass("active");
            upperSelft.addClass("active");
            setSortDir("DESC");
        } else {
            const downerSelf = $(".downer." + sortField);
            $(".sort").filter(".active").removeClass("active");
            downerSelf.addClass("active");
            setSortDir("ASC");
        }
    }

    return (
        <div>
            <button
                className='listings__table-header'
                data-sort-field={sortField}
                onClick={sortData}
            >
                <div className='mr-10'>{columnName}</div>
                {isSortableHeader && (
                    <div className='col-flex-center'>
                        {" "}
                        <span className={"upper sort " + sortField}></span>
                        <span className={"downer sort " + sortField}></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ColumnHeader;
