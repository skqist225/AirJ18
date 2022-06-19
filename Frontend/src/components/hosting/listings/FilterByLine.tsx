import { Checkbox } from "antd";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { amenityState } from "../../../features/amenity/amenitySlice";
import { fetchUserOwnedRoom, roomState, setRoomQuery } from "../../../features/room/roomSlice";
import { Image } from "../../../globalStyle";
import { getImage } from "../../../helpers";
import { IncAndDecBtn } from "../../utils/IncAndDecBtn";
import AmenityRow from "./AmenityRow";
import { FilterButton } from "./components";

import $ from "jquery";
import "./css/filter_by_line.css";

interface IFilterByLineProps {}

const FilterByLine: FC<IFilterByLineProps> = () => {
    const dispatch = useDispatch();
    const { amenities } = useSelector(amenityState);
    const { pathname } = useLocation();
    const { filterObject } = useSelector(roomState);
    const params = useParams();

    function findRoomByNameAndId() {
        dispatch(
            fetchUserOwnedRoom({
                page: parseInt(pathname.split("/").pop() as string),
                query: $("#listings__search-input").val() as string,
            })
        );
    }

    function handleFindRoomByQuery(event: any) {
        setRoomQuery(event.currentTarget.value);
        dispatch(
            fetchUserOwnedRoom({
                ...filterObject,
                page: parseInt(params.page!),
                query: event.currentTarget.value,
            })
        );
    }

    return (
        <div className='normal-flex'>
            <div className='listings__search--room normal-flex'>
                <button
                    className='listings__transparent-btn flex-center'
                    // onClick={findRoomByNameAndId}
                >
                    <Image src={getImage("/svg/search.svg")} size='12px' />
                </button>
                <div className='f1'>
                    <input
                        type='text'
                        placeholder='Tìm kiếm nhà/phòng cho thuê'
                        id='listings__search-input'
                        onChange={handleFindRoomByQuery}
                    />
                </div>
            </div>

            <FilterButton
                dataDropDown='listings__filter-roomAndBedRoom'
                title='Phòng và phòng ngủ'
                width='300px'
                height='300px'
                content={
                    <>
                        <div className='filter-box'>
                            <div className='flex-space listings__filter-roomAndBedRoom-row'>
                                <div>Phòng ngủ</div>
                                <IncAndDecBtn
                                    dataEdit='listings__bed-room-count'
                                    dataTrigger='roomAndBedRoom'
                                />
                            </div>
                            <div className='flex-space listings__filter-roomAndBedRoom-row'>
                                <div>Giường</div>
                                <IncAndDecBtn
                                    dataEdit='listings__bed-count'
                                    dataTrigger='roomAndBedRoom'
                                />
                            </div>
                            <div className='flex-space listings__filter-roomAndBedRoom-row'>
                                <div>Phòng tắm</div>
                                <IncAndDecBtn
                                    dataEdit='listings__bath-room-count'
                                    dataTrigger='roomAndBedRoom'
                                />
                            </div>
                        </div>
                    </>
                }
                footerOf='roomAndBedRoom'
            />
            <FilterButton
                dataDropDown='listings__filter-amentities'
                title='Tiện nghi'
                width='500px'
                height='455px'
                content={
                    <>
                        <div className='grid-2 filter-box h-80'>
                            {amenities.map(amenity => (
                                <AmenityRow amenity={amenity} key={amenity.id} />
                            ))}
                        </div>
                    </>
                }
                footerOf='amenities'
            />
            <FilterButton
                dataDropDown='listings__filter-status'
                title='Tình trạng nhà/phòng cho thuê'
                width='300px'
                height='229px'
                content={
                    <>
                        <div className='f1 p-24'>
                            <div className='normal-flex listings__filter-status-row'>
                                <Checkbox value='ACTIVE' className='statusSelected' />
                                <div style={{ marginLeft: "10px" }}>Đã đăng</div>
                            </div>
                            <div className='normal-flex listings__filter-status-row'>
                                <Checkbox value='UNLISTED' className='statusSelected' />
                                <div style={{ marginLeft: "10px" }}>Đã hủy đăng</div>
                            </div>
                        </div>
                    </>
                }
                footerOf='status'
            />
            {/* <FilterButton
                dataDropDown='listings__filter-others'
                title='Các bộ lọc khác'
                width='300px'
                height='229px'
                content={
                    <>
                        <div className='filter-box overflow-hidden'>
                            <div className='normal-flex listings__filter-others-row'>
                                <Checkbox />
                                <div style={{ marginLeft: "10px" }}>Chế độ Đặt ngay đang tắt</div>
                            </div>
                            <div className='normal-flex listings__filter-others-row'>
                                <Checkbox />
                                <div style={{ marginLeft: "10px" }}>
                                    Yêu cầu cập nhật mục cho thuê
                                </div>
                            </div>
                        </div>
                    </>
                }
                footerOf='others'
            /> */}

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
    );
};

export default FilterByLine;
