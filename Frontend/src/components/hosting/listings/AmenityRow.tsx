import { FC } from 'react';
import IAmenity from '../../../types/type_Amenity';

interface IAmenityRowProps {
    amenity: IAmenity;
}

const AmenityRow: FC<IAmenityRowProps> = ({ amenity }) => {
    return (
        <div className='listings__filter-amentities-row normal-flex'>
            <div className='flex-2'>
                <input
                    type='checkbox'
                    width='20px'
                    height='20px'
                    value={amenity.id}
                    className='amentitySelected'
                />
            </div>
            <div className='flex-2 amn-name'>{amenity.name}</div>
        </div>
    );
};

export default AmenityRow;
