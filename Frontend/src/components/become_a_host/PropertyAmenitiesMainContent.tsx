import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAmenities } from '../../features/amenity/amenitySlice';
import { Div } from '../../globalStyle';
import { RootState } from '../../store';
import IAmenity from '../../types/type_Amenity';
import AmenitiyPartial from './AmenitiyPartial';
import $ from 'jquery';

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

    useEffect(() => {
        const prominentAmentities = $('.prominentAmentities');
        const favoriteAmentities = $('.favoriteAmentities');
        const safeAmentities = $('.safeAmentities');

        if (localStorage.getItem('room')) {
            const { prominentAmentity, favoriteAmentity, safeAmentity } = JSON.parse(
                localStorage.getItem('room')!
            );

            prominentAmentities.each(function () {
                if ($(this).children('input').first().val() === prominentAmentity + '') {
                    $(this).addClass('choosen');
                    return false;
                }
            });

            favoriteAmentities.each(function () {
                if ($(this).children('input').first().val() === favoriteAmentity + '') {
                    $(this).addClass('choosen');
                    return false;
                }
            });

            safeAmentities.each(function () {
                if ($(this).children('input').first().val() === safeAmentity + '') {
                    $(this).addClass('choosen');
                    return false;
                }
            });
        }

        prominentAmentities.each(function () {
            $(this).on('click', function () {
                prominentAmentities.each(function () {
                    $(this).removeClass('choosen');
                });

                $(this).addClass('choosen');
            });
        });
        favoriteAmentities.each(function () {
            $(this).on('click', function () {
                favoriteAmentities.each(function () {
                    $(this).removeClass('choosen');
                });

                $(this).addClass('choosen');
            });
        });
        safeAmentities.each(function () {
            $(this).on('click', function () {
                safeAmentities.each(function () {
                    $(this).removeClass('choosen');
                });

                $(this).addClass('choosen');
            });
        });
    }, [amenities]);

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
