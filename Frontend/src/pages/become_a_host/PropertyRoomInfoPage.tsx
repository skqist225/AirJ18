import { FC } from 'react';
import {
    LeftPageContent,
    PropertyRoomInfoMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import { Div } from '../../globalStyle';

interface IPropertyRoomInfoPageProps {}

const PropertyRoomInfoPage: FC<IPropertyRoomInfoPageProps> = () => {
    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background=''
                    title='Điều nào sau đây mô tả chính xác nhất về nơi ở của bạn?'
                />
                <RightPageContent
                    nextPage='amenities'
                    prevPage='location'
                    MainContent={<PropertyRoomInfoMainContent />}
                    stepNumber={5}
                />
            </Div>
        </Div>
    );
};

export default PropertyRoomInfoPage;
