import { FC } from 'react';
import { ManageYSContainer } from '.';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers';
import { IRoomDetails } from '../../types/room/type_RoomDetails';
import BoxFooter from './BoxFooter';
import DisplayEditUI from './components/DisplayEditUI';
import HideEditBox from './components/HideEditBox';

interface IEditLocationProps {
    room: IRoomDetails;
}

const EditLocation: FC<IEditLocationProps> = ({ room }) => {
    return (
        <ManageYSContainer id='roomLocation'>
            <div id='manage-ys__location-control-view'>
                <h3 className='manage--ys__section--title'>Vị trí</h3>
                <div>
                    <div className='flex-space'>
                        <div>
                            <div className='manage-ys__section-content-title'>Địa chỉ</div>
                            <div className='manage-ys__section-content-info'>
                                {/* {room?.cityName}, {room.stateName},
                                               {room.countryName} */}
                            </div>
                        </div>
                        <div>
                            <DisplayEditUI sectionKey='location' />
                        </div>
                    </div>
                </div>
            </div>
            <div id='manage-ys__location-control-container'>
                <div className='manage-ys__location-control-content'>
                    <div className='flex-space'>
                        <div className='manage-ys__header-edit-main-title'>Địa chỉ</div>
                        <HideEditBox sectionKey='location' />
                    </div>
                    <div style={{ maxWidth: '584px' }}>
                        <div style={{ margin: '25px 0' }}>
                            <button
                                className='
                                                    manage-ys__location-control__useCurrentPosition-btn
                                                '
                                // onclick="useCurrentPosition();"
                            >
                                <span>
                                    <Image src={getImage('/svg/pin_drop.svg')} size='16px' />
                                </span>
                                <span>Sử dụng địa chỉ hiện tại</span>
                            </button>
                        </div>
                        <div>
                            <div>Quốc gia/Khu vực</div>
                            <select id='manage-ys__location-country' className='manage-ys__input'>
                                {/* <th:blockeach="c : ${countries}">
                                                    <option
                                                       value="${c.id}"
                                                       selected="${c.id == room.country.id}"
                                                    >
                                                        [[${c.name}]]
                                                    </option>
                                                </th:blockeach=> */}
                            </select>
                        </div>
                        <div>
                            <div>Đường/phố</div>
                            <div>
                                <input
                                    type='text'
                                    value="${room.street == null ? '' : room.street}"
                                    className='manage-ys__input'
                                    id='manage-ys__location-street'
                                />
                            </div>
                        </div>
                        <div>
                            <div className='grid-2'>
                                <div className='col-flex'>
                                    <div>Thành phố</div>
                                    <div>
                                        <input
                                            type='text'
                                            value={room?.cityName}
                                            className='manage-ys__input'
                                            id='manage-ys__location-city'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>Tỉnh</div>
                                    <div>
                                        <input
                                            type='text'
                                            //    value=room.state.name}"
                                            className='manage-ys__input'
                                            id='manage-ys__location-state'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <BoxFooter dataEdit='location' idInput='' />
            </div>
        </ManageYSContainer>
    );
};

export default EditLocation;
