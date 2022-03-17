import { Checkbox } from 'antd';
import { FC } from 'react';
import IAmenity from '../../../types/type_Amenity';

interface IAmenityRowProps {
    amenity: IAmenity;
}

const AmenityRow: FC<IAmenityRowProps> = ({ amenity }) => {
    return (
        <div className='normal-flex'>
            <div className='normal-flex'>
                <Checkbox value={amenity.id} className='amenity' />
            </div>
            <div className='normal-flex amn-name'>{amenity.name}</div>
        </div>
    );
};

export default AmenityRow;
