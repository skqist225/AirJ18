import { FC } from 'react';
import {
    LeftPageContent,
    PropertyRoomImagesMainContent,
    RightPageContent,
} from '../../components/become_a_host';

import { Div } from '../../globalStyle';

interface IPropertyRoomImagesPageProps {}

const PropertyRoomImagesPage: FC<IPropertyRoomImagesPageProps> = () => {
    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/photo.jpg'
                    title='Tiếp theo, hãy thêm một số ảnh chụp chỗ ở của bạn'
                />
                <RightPageContent
                    nextPage='title'
                    prevPage='amenities'
                    MainContent={<PropertyRoomImagesMainContent />}
                    stepNumber={7}
                />
            </Div>
        </Div>
    );
};

export default PropertyRoomImagesPage;
