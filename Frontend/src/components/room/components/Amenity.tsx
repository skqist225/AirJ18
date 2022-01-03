import { FC } from 'react';
import { getImage } from '../../../helpers/getImage';
import { IAmenity } from '../../../type/type_RoomDetails';

export interface IAmenityProps {
    amenity: IAmenity;
}

const Amenity: FC<IAmenityProps> = ({ amenity: a }) => {
    return (
        <div className='normal-flex rdt__amenity--wrapper' key={a.name}>
            <span>
                <img src={getImage(a.icon)} className='rdt__amenity--icon' />
            </span>
            <span className='rdt__amenity--name'>{a.name}</span>
        </div>
    );
};

export default Amenity;
