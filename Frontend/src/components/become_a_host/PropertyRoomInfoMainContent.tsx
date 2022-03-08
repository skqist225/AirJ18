import { FC } from 'react';
import { IncAndDecBtn } from '../hosting/listings/IncAndDecBtn';
import './css/room_info_main_content.css';

interface IPropertyRoomInfoMainContentProps {}

const PropertyRoomInfoMainContent: FC<IPropertyRoomInfoMainContentProps> = () => {
    return (
        <div className='col-flex'>
            <div className='flex-space' style={{ marginBottom: '32px' }}>
                <div className='room-info__info-title'>Khách</div>
                <IncAndDecBtn dataEdit='guestNumber' dataTrigger='guestNumber' />
            </div>
            <div className='flex-space' style={{ marginBottom: '32px' }}>
                <div className='room-info__info-title'>Giường</div>
                <IncAndDecBtn dataEdit='bedNumber' dataTrigger='bedNumber' />
            </div>
            <div className='flex-space' style={{ marginBottom: '32px' }}>
                <div className='room-info__info-title'>Phòng ngủ</div>
                <IncAndDecBtn dataEdit='bedRoomNumber' dataTrigger='bedRoomNumber' />
            </div>
            <div className='flex-space' style={{ marginBottom: '32px' }}>
                <div className='room-info__info-title'>Phòng tắm</div>
                <IncAndDecBtn dataEdit='bathRoomNumber' dataTrigger='bathRoomNumber' />
            </div>
        </div>
    );
};

export default PropertyRoomInfoMainContent;
