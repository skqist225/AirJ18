import { FC } from 'react';
import { Image } from '../../../globalStyle';
import { getImage } from '../../../helpers';

import '../css/room_status.css';

interface IRoomStatusProps {
    id: string;
    imageName: string;
    title: string;
    subTitle: string;
}

const RoomStatus: FC<IRoomStatusProps> = ({ id, imageName, title, subTitle }) => {
    return (
        <div className='normal-flex room--status'>
            <div>
                <input type='radio' id={id} className='radioStatus' />
            </div>
            <div>
                <div className='normal-flex mr-10'>
                    <Image src={getImage(imageName)} size='14px' />
                    <div>{title}</div>
                </div>
                <div className='manage-ys__status-control-subtext'>{subTitle}</div>
            </div>
        </div>
    );
};

export default RoomStatus;
