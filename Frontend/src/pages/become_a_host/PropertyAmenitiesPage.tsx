import { FC } from 'react';
import {
    LeftPageContent,
    PropertyAmenitiesMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import { Div } from '../../globalStyle';

interface IPropertyAmenitiesPageProps {}

const PropertyAmenitiesPage: FC<IPropertyAmenitiesPageProps> = () => {
    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/amentities.jpg'
                    title='Cho khách biết chỗ ở của bạn có những gì?'
                />
                <RightPageContent
                    nextPage='photos'
                    prevPage='room-info'
                    MainContent={<PropertyAmenitiesMainContent />}
                    stepNumber={6}
                />
            </Div>
        </Div>
    );
};

export default PropertyAmenitiesPage;
