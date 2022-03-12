import { FC } from 'react';
import datediff, { parseDBDate } from '../../../helpers/datediff';
import { getImage } from '../../../helpers';
import { IRoomListings } from '../../../type/room/type_RoomListings';
import { MyNumberForMat } from '../../utils';

interface IRoomDataRowProps {
    room: IRoomListings;
    email: string;
}

export const RoomDataRow: FC<IRoomDataRowProps> = ({ room, email }) => {
    return (
        <tr data-room-id={room.id}>
            <td>
                <div className='room-listings__room-data-id'>{room.id}</div>
            </td>
            <td>
                <div className='normal-flex'>
                    <div className='listings__room-thumbnail-container'>
                        <img
                            src={getImage(`/room_images/${email}/${room.id}/${room.thumbnail}`)}
                            alt="Room's thumbnail'"
                            className='listings__room-thumbnail'
                        />
                    </div>
                    <div className='listings__room-name'>{room.name}</div>
                </div>
            </td>
            <td>
                <div style={{ height: '100%' }} className='normal-flex'>
                    <div>
                        <img src='' alt='' />
                    </div>
                    <div>{room.status === true ? 'Hoàn thành' : 'Đang tiến hành'}</div>
                </div>
            </td>
            <td>
                <div>
                    <MyNumberForMat price={room.price} currency={room.currency} />
                </div>
            </td>
            <td>
                <div className='normal-flex'>
                    {/* <div>
                        <svg
                            viewBox='0 0 16 16'
                            xmlns='http://www.w3.org/2000/svg'
                            style={{
                                display: 'block',
                                height: '16px',
                                width: '16px',
                                fill: '#008a05',
                            }}
                            aria-hidden='true'
                            role='presentation'
                            focusable='false'
                        >
                            <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.159 4.869L6.67 9.355 4.42 7.105 3.289 8.236 6.67 11.62 12.291 6z'></path>
                        </svg>
                    </div> */}
                    {/* <div style={{ marginLeft: '8px' }}>Bật</div> */}
                    {room.category}
                </div>
            </td>
            <td className='listings__td-text' data-column='BEDROOM'>
                {room.bedroomCount}
            </td>
            <td className='listings__td-text' data-column='BED'>
                {room.bedCount}
            </td>
            <td className='listings__td-text' data-column='BATHROOM'>
                {room.bathroomCount}
            </td>
            <td className='listings__td-text'>{room.location}</td>
            <td className='listings__td-text' data-column='LASTMODIFIED'>
                {datediff(new Date().getTime(), parseDBDate(room.updatedDate).getTime())} ngày
            </td>
            <td></td>
        </tr>
    );
};

export default RoomDataRow;
