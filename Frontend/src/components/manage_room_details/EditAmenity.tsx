import { FC } from 'react';
import { ManageYSContainer } from '.';
import { hideEditBox } from '../../pages/script/manage_your_space';
import IAmenity from '../../types/type_Amenity';
import BoxFooter from './BoxFooter';
import DisplayEditUI from './components/DisplayEditUI';
import HideEditBox from './components/HideEditBox';
import RoomAmenities from './components/RoomAmenities';

interface IEditAmenityProps {
    amenities: IAmenity[];
}

const EditAmenity: FC<IEditAmenityProps> = ({ amenities }) => {
    const prominentAmentities = amenities.filter(a => a.prominent);
    const safeAmentities = amenities.filter(a => a.safe);
    const favoriteAmentities = amenities.filter(a => a.favorite);

    return (
        <ManageYSContainer id='roomAmentities'>
            <div id='manage-ys__amentities-control-view' className='flex-space'>
                <div>
                    <div className='manage--ys__section--title'>Tiện nghi</div>
                    <div>
                        {amenities.map(a => (
                            <div key={a.id}>
                                <div
                                    data-amenity-id={a.id}
                                    className='manage-ys__section-content-info'
                                >
                                    {a.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <DisplayEditUI sectionKey='amentities' />
                </div>
            </div>
            <div id='manage-ys__amentities-control-container'>
                <div className='manage-ys__location-control-content'>
                    <div className='flex-space'>
                        <div className='manage-ys__header-edit-main-title'>Tiện nghi</div>
                        <HideEditBox sectionKey='amentities' hideEditBox={hideEditBox} />
                    </div>
                    <RoomAmenities
                        title='Tiện nghi nổi bật'
                        amentities={prominentAmentities}
                        dataType='prominentAmentities'
                    />
                    <RoomAmenities
                        title='Tiện nghi yêu thích'
                        amentities={favoriteAmentities}
                        dataType='favoriteAmentities'
                    />
                    <RoomAmenities
                        title='Tiện nghi an toàn'
                        amentities={safeAmentities}
                        dataType='safeAmentities'
                    />
                </div>
                <BoxFooter sectionKey='amentities' idInput='' hideEditBox={hideEditBox} />
            </div>
        </ManageYSContainer>
    );
};

export default EditAmenity;
