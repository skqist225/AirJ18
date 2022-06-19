import { FC, useState } from "react";
import { ManageYSContainer } from ".";
import { Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import { IRoomDetails } from "../../types/room/type_RoomDetails";
import { IncAndDecBtn } from "../utils/IncAndDecBtn";
import BoxFooter from "./BoxFooter";
import DisplayEditUI from "./components/DisplayEditUI";
import HideEditBox from "./components/HideEditBox";
import RoomStatus from "./components/RoomStatus";

import "./css/edit_room_info.css";
import { hideEditBox, onKeyDown } from "../../pages/script/manage_your_space";

interface IEditRoomInfoProps {
    room: IRoomDetails;
}

const EditRoomInfo: FC<IEditRoomInfoProps> = ({ room }) => {
    const [roomName, setRoomName] = useState(room?.name);
    const [roomDescription, setRoomDescription] = useState(room?.description);

    return (
        <ManageYSContainer id='basicRoomInfos' data-aos='fade-down' data-aos-duration='2000'>
            <div className='manage--ys__section--title'>Thông tin cơ bản về nhà/phòng cho thuê</div>
            <div className='viewAndEdit__line'>
                <div
                    className='flex-space manage-ys__section-content'
                    id='manage-ys__name-control-view'
                >
                    <div>
                        <div className='manage-ys__section-content-title'>
                            Tiêu đề nhà phòng cho thuê
                        </div>
                        <div className='manage-ys__section-content-info'>{roomName}</div>
                    </div>

                    <div>
                        <DisplayEditUI sectionKey='name' />
                    </div>
                </div>
                <div id='manage-ys__name-control-container'>
                    <div className='manage-ys__section-edit'>
                        <div>
                            <div className='flex-space' style={{ alignItems: "flex-start" }}>
                                <div style={{ flex: "1", maxWidth: "600px" }}>
                                    <div className='manage-ys__header-edit-main-title'>
                                        Tiêu đề nhà/phòng cho thuê
                                    </div>
                                    <div className='manage-ys__header-edit-main-subtitle'>
                                        Tiêu đề nhà/phòng cho thuê của bạn cần nêu bật được những
                                        điểm đặc biệt của chỗ ở.
                                    </div>
                                </div>

                                <HideEditBox
                                    hideEditBox={hideEditBox}
                                    sectionKey='name'
                                    name={roomName}
                                />
                            </div>
                            <div className=''>
                                <div>
                                    <input
                                        type='text'
                                        className='_dsnwjc'
                                        id='roomNameInput'
                                        value={roomName}
                                        data-input-id='#roomNameCounter'
                                        onKeyDown={onKeyDown}
                                        onChange={e => setRoomName(e.currentTarget.value)}
                                    />
                                </div>
                                <div className='counter'>
                                    <span id='roomNameCounter'>0</span>/50
                                </div>
                            </div>
                        </div>
                    </div>

                    <BoxFooter
                        sectionKey='name'
                        idInput='#roomNameInput'
                        hideEditBox={hideEditBox}
                    />
                </div>
            </div>
            <div className='viewAndEdit__line'>
                <div
                    className='flex-space manage-ys__section-content'
                    id='manage-ys__description-control-view'
                >
                    <div>
                        <div className='manage-ys__section-content-title'>
                            Mô tả nhà/phòng cho thuê
                        </div>
                        <div className='manage-ys__section-content-info'>{roomDescription}</div>
                    </div>
                    <div>
                        <DisplayEditUI sectionKey='description' />
                    </div>
                </div>
                <div id='manage-ys__description-control-container'>
                    <div style={{ padding: "24px 24px 0" }}>
                        <div className='flex-space'>
                            <div className='manage-ys__header-edit-main-title'>
                                <div>Mô tả nhà/phòng cho thuê</div>
                            </div>
                            <HideEditBox
                                sectionKey='description'
                                description={roomDescription}
                                hideEditBox={hideEditBox}
                            />
                        </div>
                        <div className=''>
                            <div style={{ marginBottom: "10px" }}>
                                <textarea
                                    className='_dsnwjc'
                                    style={{ width: "693px" }}
                                    draggable='true'
                                    id='descriptionInput'
                                    value={roomDescription}
                                    data-input-id='#descriptionCounter'
                                    onKeyDown={onKeyDown}
                                    onChange={e => setRoomDescription(e.currentTarget.value)}
                                ></textarea>
                            </div>
                            <div className='counter'>
                                <span id='descriptionCounter'>0</span>/500
                            </div>
                        </div>
                    </div>

                    <BoxFooter
                        sectionKey='description'
                        idInput='#descriptionInput'
                        hideEditBox={hideEditBox}
                    />
                </div>
            </div>

            <div className='viewAndEdit__line'>
                <div className='flex-space manage-ys__section-content'>
                    <div className='manage-ys__section-content-title'>Số lượng khách</div>
                    <div>
                        <IncAndDecBtn
                            dataEdit='guestNumber'
                            dataTrigger=''
                            data={room!.accomodates}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div
                    className='flex-space manage-ys__section-content'
                    id='manage-ys__status-control-view'
                >
                    <div>
                        <div className='manage-ys__section-content-title'>
                            Trạng thái nhà/phòng cho thuê
                        </div>
                        <div className='manage-ys__section-content-info'>
                            <span className='mr-10'>
                                {!room?.status ? (
                                    <Image src={getImage("/svg/reddot.svg")} size='10px' />
                                ) : (
                                    <Image src={getImage("/svg/greendot.svg")} size='10px' />
                                )}
                            </span>
                            {!room!.status ? "Đã hủy đăng" : "Đang đăng"} - Khách không thể đặt
                            phòng hoặc tìm thấy nhà/phòng cho thuê của bạn trong kết quả tìm kiếm.
                        </div>
                    </div>
                    <div>
                        <DisplayEditUI sectionKey='status' />
                    </div>
                </div>
                <div id='manage-ys__status-control-container'>
                    <div className='manage-ys__status-control-edit-content'>
                        <div>
                            <div className='manage-ys__header-edit-main-title'>
                                Trạng thái nhà/phòng cho thuê
                            </div>
                            <div style={{ cursor: "pointer" }}>
                                <Image src={getImage("/svg/close.svg")} size='14px' />
                            </div>
                        </div>
                        <div style={{ flex: "1", paddingBottom: "20px" }}>
                            <RoomStatus
                                id='roomStatus1'
                                imageName='greendot'
                                title='Đã đăng'
                                subTitle='Khách có thể tìm thấy nhà/phòng cho thuê của bạn trong kết quả tìm kiếm và yêu cầu
                thông tin về tình trạng còn phòng hoặc đặt phòng vào những ngày còn trống.'
                            />
                            <RoomStatus
                                id='roomStatus0'
                                imageName='reddot'
                                title='Đã hủy đăng'
                                subTitle='Khách không thể đặt phòng hoặc tìm thấy nhà/phòng cho thuê của bạn trong kết quả tìm kiếm.'
                            />
                            {/* <RoomStatus
                                id='deleteRoom'
                                imageName='stop'
                                title='Hủy kích hoạt'
                                subTitle='Xóa vĩnh viễn nhà/phòng cho thuê của bạn
                                                        khỏi AirJ18.' */}
                            {/* /> */}
                        </div>
                    </div>
                    <BoxFooter sectionKey='status' idInput='' hideEditBox={hideEditBox} />
                </div>
            </div>
        </ManageYSContainer>
    );
};

export default EditRoomInfo;
