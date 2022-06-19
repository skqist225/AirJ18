import { FC } from "react";
import { useSelector } from "react-redux";
import { roomState } from "../../../features/room/roomSlice";
import IAmenity from "../../../types/type_Amenity";
import $ from "jquery";

interface IRoomAmenitiesProps {
    title: string;
    amentities: IAmenity[];
    dataType: string;
}

const RoomAmenities: FC<IRoomAmenitiesProps> = ({ title, amentities, dataType }) => {
    const { room } = useSelector(roomState);

    const amenitiesIds = room?.amenities.map(({ id }) => id);
    console.log(amenitiesIds);

    if (room!.amenities) {
        $(".manage-ys__uncheck-btn").each(function () {
            if (!amenitiesIds!.includes($(this).data("edit"))) {
                $(this).addClass("checked");
                $(this)
                    .siblings(`.manage-ys__check-btn.${$(this).data("edit")}`)
                    .removeClass("checked");
            }
        });
    }
    return (
        <div>
            <div className='manage-ys__header-edit-main-title'>{title}</div>
            <div>
                {amentities.map(amentity => (
                    <div
                        className='flex-space'
                        style={{
                            height: "80px",
                            padding: " 24px 0",
                            borderBottom: "1px solid rgb(221, 221, 221)",
                        }}
                        key={amentity.id}
                    >
                        <div>{amentity.name}</div>
                        <div className='normal-flex'>
                            <button
                                className='manage-ys__uncheck-btn mr-10'
                                data-edit={amentity.id}
                            >
                                <span>
                                    <svg
                                        viewBox='0 0 32 32'
                                        xmlns='http://www.w3.org/2000/svg'
                                        aria-hidden='true'
                                        role='presentation'
                                        focusable='false'
                                        style={{
                                            display: "block",
                                            fill: "none",
                                            height: "16px",
                                            width: "16px",
                                            stroke: " rgb(113, 113, 113)",
                                            strokeWidth: "3",
                                            overflow: "visible",
                                        }}
                                    >
                                        <path d='m6 6 20 20'></path>
                                        <path d='m26 6-20 20'></path>
                                    </svg>
                                </span>
                            </button>
                            <button
                                className={`manage-ys__check-btn ${amentity.id}`}
                                data-edit={amentity.id}
                                data-type={dataType}
                            >
                                <span>
                                    <svg
                                        viewBox='0 0 32 32'
                                        xmlns='http://www.w3.org/2000/svg'
                                        aria-hidden='true'
                                        role='presentation'
                                        focusable='false'
                                        style={{
                                            display: "block",
                                            fill: "none",
                                            height: "16px",
                                            width: "16px",
                                            stroke: "currentcolor",
                                            strokeWidth: "3",
                                            overflow: "visible",
                                        }}
                                    >
                                        <path fill='none' d='m4 16.5 8 8 16-16'></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomAmenities;
