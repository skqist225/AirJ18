import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAmenities } from '../../features/amenity/amenitySlice';
import { Div } from '../../globalStyle';
import { RootState } from '../../store';
import IAmenity from '../../type/type_Amenity';
import AmenitiyPartial from './AmenitiyPartial';
import './css/amenities_main_content.css';

interface IPropertyAmenitiesMainContentProps {}

const PropertyAmenitiesMainContent: FC<IPropertyAmenitiesMainContentProps> = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAmenities());
    }, []);

    const { amenities } = useSelector((state: RootState) => state.amenity);
    const prominentAmentities: IAmenity[] = amenities.filter(a => a.prominent === true);
    const favoriteAmentities: IAmenity[] = amenities.filter(a => a.favorite === true);
    const safeAmentities: IAmenity[] = amenities.filter(a => a.safe === true);

    return (
        <>
            {' '}
            <Div className='col-flex'>
                <Div className='col-flex'>
                    <div className='amentities__title'>Bạn có tiện nghi nào nổi bật không?</div>
                    <div>
                        <AmenitiyPartial
                            amenities={prominentAmentities}
                            className='prominentAmentities'
                        />
                    </div>
                </Div>
                <div className='flexCol'>
                    <div className='amentities__title'>
                        Còn những tiện nghi yêu thích của khách sau đây thì sao?
                    </div>
                    <div>
                        <AmenitiyPartial
                            amenities={favoriteAmentities}
                            className='favoriteAmentities'
                        />
                    </div>
                </div>
                <div className='flexCol'>
                    <div className='amentities__title'>
                        Bạn có tiện nghi nào trong số những tiện nghi đảm bảo an toàn này không?
                    </div>
                    <div>
                        <AmenitiyPartial amenities={safeAmentities} className='safeAmentities' />
                    </div>
                </div>
            </Div>
        </>
    );
};

export default PropertyAmenitiesMainContent;
