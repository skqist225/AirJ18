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
                    gradientBackground={`    
                    background: #fc5c7d;
                    background: -webkit-linear-gradient(
                        to right,
                        #6a82fb,
                        #fc5c7d
                    );
                    background: linear-gradient(
                        to right,
                        #6a82fb,
                        #fc5c7d
                    );`}
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
