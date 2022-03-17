import { FC } from 'react';
import { ManageYSContainer } from '.';
import { Div } from '../../globalStyle';
import { IRoomDetails } from '../../types/room/type_RoomDetails';
import BoxFooter from './BoxFooter';
import { HideEditBox } from './components';
import DisplayEditUI from './components/DisplayEditUI';

interface IEditRoomCountProps {
    room: IRoomDetails;
}

const EditRoomCount: FC<IEditRoomCountProps> = ({ room }) => {
    return (
        <ManageYSContainer id='roomInfo' data-aos='fade-up' data-aos-duration='2000'>
            <div>
                <div className='manage--ys__section--title'>Chỗ ở và phòng</div>
                <div>
                    <div>
                        <div
                            // style="height: 85px; border-bottom: 1px solid #d3d6db"
                            className='flex-space'
                            id='manage-ys__groupAndTypeAndPrivacy-control-view'
                        >
                            <div>
                                <div className='manage-ys__section-content-title'>Loại chỗ ở</div>
                                <div className='manage-ys__section-content-info'>
                                    {/* [[${room.roomGroup != null ? room.roomGroup.name
                                                    : 'ko'}]] cho thuê */}
                                </div>
                                <div className='manage-ys__section-content-info'>
                                    {/* Loại hình cho thuê: [[${room.privacyType != null
                                                    ? room.privacyType.name : 'Toàn bộ nhà'}]] */}
                                </div>
                            </div>
                            <div>
                                <DisplayEditUI sectionKey='groupAndTypeAndPrivacy' />
                            </div>
                        </div>
                        <div id='manage-ys__groupAndTypeAndPrivacy-control-container'>
                            <div className='manage-ys__location-control-content'>
                                <div className='flex-space'>
                                    <div className='manage-ys__header-edit-main-title'>
                                        Loại chỗ ở
                                    </div>
                                    <HideEditBox sectionKey='groupAndTypeAndPrivacy' />
                                </div>
                                <div>
                                    <div>
                                        <div className='manage-ys__label'>
                                            Loại nào giống nhà/phòng cho thuê của bạn nhất?
                                        </div>
                                        <div>
                                            <select
                                                id='manage-ys__group-input'
                                                className='manage-ys__input'
                                            >
                                                {/* <th:block
                                                                   each="g : ${roomGroup}"
                                                                >
                                                                    <option
                                                                       value="${g.id}"
                                                                       selected="${g.id == room.roomGroup.id}"
                                                                    >
                                                                        [[${g.name}]]
                                                                    </option>
                                                                </th:block> */}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='manage-ys__label'>Loại nhà/phòng</div>
                                        <div>
                                            <select
                                                id='manage-ys__type-input'
                                                className='manage-ys__input'
                                            >
                                                {/* <th:block
                                                                   each="c : ${categories}"
                                                                >
                                                                    <option
                                                                       value="${c.id}"
                                                                       selected="${c.id == room.category.id}"
                                                                    >
                                                                        [[${c.name}]]
                                                                    </option>
                                                                </th:block> */}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Loại nhà/phòng cho thuê</div>
                                        <div>
                                            <select
                                                id='manage-ys__privacy-input'
                                                className='manage-ys__input'
                                            >
                                                {/* <th:block
                                                                   each="pt : ${privacyType}"
                                                                >
                                                                    <option
                                                                       value="${pt.id}"
                                                                       selected="${pt.id == room.privacyType.id}"
                                                                    >
                                                                        [[${pt.name}]]
                                                                    </option>
                                                                </th:block> */}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <BoxFooter dataEdit='groupAndTypeAndPrivacy' idInput='' />
                        </div>
                    </div>

                    <div>
                        <div id='manage-ys__roomInfo-control-view'>
                            <Div className='flex-space' height='139px'>
                                <div>
                                    <div className='manage-ys__section-content-title'>
                                        Phòng và không gian khác
                                    </div>
                                    <div className='manage-ys__section-content-info'>
                                        Phòng ngủ: {room?.bedroom}
                                    </div>
                                    <div className='manage-ys__section-content-info'>
                                        Giường: {room?.bed}
                                    </div>
                                    <div className='manage-ys__section-content-info'>
                                        Phòng tắm: {room?.bathroom}
                                    </div>
                                </div>
                                <div>
                                    <DisplayEditUI sectionKey='roomInfo' />
                                </div>
                            </Div>
                        </div>
                        <div id='manage-ys__roomInfo-control-container'>
                            <div className='manage-ys__location-control-content'>
                                <div className='flex-space'>
                                    <div className='manage-ys__header-edit-main-title'>
                                        Phòng ngủ và không gian khác
                                    </div>
                                    {/* <div
                                                       replace="manage_space/_manage_your_space_partial :: hideEditBox('roomInfo')"
                                                    ></div>
                                                </div>
                                                <div
                                                   replace="manage_space/_manage_your_space_partial :: incDecSegment('bedRoom', 'Phòng ngủ', ${room.bedroomCount})"
                                                ></div>
                                                <div
                                                   replace="manage_space/_manage_your_space_partial :: incDecSegment('bed', 'Giường', ${room.bedCount})"
                                                ></div>
                                                <div
                                                   replace="manage_space/_manage_your_space_partial :: incDecSegment('bathRoom', 'Phòng tắm', ${room.bathroomCount})"
                                                ></div> */}
                                </div>
                                <BoxFooter dataEdit='roomInfo' idInput='' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ManageYSContainer>
    );
};

export default EditRoomCount;
