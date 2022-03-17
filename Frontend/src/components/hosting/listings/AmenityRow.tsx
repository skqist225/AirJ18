import { Checkbox } from 'antd';
import { FC } from 'react';
import IAmenity from '../../../types/type_Amenity';

interface IAmenityRowProps {
    amenity: IAmenity;
}

const AmenityRow: FC<IAmenityRowProps> = ({ amenity }) => {
    return (
        <div className='normal-flex'>
            <div className='flex-2'>
                <Checkbox value={amenity.id} className='amenity' />
            </div>
            <div className='flex-2 amn-name'>{amenity.name}</div>
        </div>
    );
};

export default AmenityRow;
