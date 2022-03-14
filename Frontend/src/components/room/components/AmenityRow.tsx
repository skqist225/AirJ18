import { FC } from 'react';
import { getImage } from '../../../helpers';
import { IRDAmenity } from '../../../types/room/type_RoomDetails';

export interface IAmenityProps {
    amenity: IRDAmenity;
}

const Amenity: FC<IAmenityProps> = ({ amenity: a }) => {
    return (
        <div className='normal-flex rdt__amenity--wrapper' key={a.name}>
            <span>
                <img src={getImage(a.icon)} className='rdt__amenity--icon' alt={a.name} />
            </span>
            <span className='rdt__amenity--name'>{a.name}</span>
        </div>
    );
};

export default Amenity;
