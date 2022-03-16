import { FC } from 'react';
import { IRoomDetails } from '../../types/room/type_RoomDetails';

interface ILocationAndLikeShareProps {
    room: IRoomDetails;
}

const LocationAndLikeShare: FC<ILocationAndLikeShareProps> = ({ room }) => {
    return (
        <div className='rdt_below__header flex'>
            <div className='rdt_location__info text'>
                <span>{room!.location}</span>
            </div>
            <div className='rdt_header__action'>
                <button className='room__likeBtn rdt_button__action' data-room-id={room!.id}>
                    <svg
                        viewBox='0 0 32 32'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                        role='presentation'
                        focusable='false'
                        style={{
                            display: 'block',
                            fill: 'rgba(0, 0, 0, 0.5)',
                            height: '20px',
                            width: '20px',
                            stroke: 'rgb(255, 255, 255)',
                            strokeWidth: '2',
                            overflow: 'visible',
                        }}
                        className='heartSvg'
                    >
                        <path d='m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z'></path>
                    </svg>
                    <span>Lưu</span>
                </button>
            </div>
        </div>
    );
};

export default LocationAndLikeShare;
