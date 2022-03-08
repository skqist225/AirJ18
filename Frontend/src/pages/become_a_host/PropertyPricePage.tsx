import { FC } from 'react';
import {
    LeftPageContent,
    PropertyPriceMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import { Div } from '../../globalStyle';

interface IPropertyPricePageProps {}

const PropertyPricePage: FC<IPropertyPricePageProps> = () => {
    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/room_price_step.jpg'
                    title='Bây giờ đến phần thú vị rồi – đặt giá cho thuê'
                />
                <RightPageContent
                    nextPage='preview'
                    prevPage='description'
                    MainContent={<PropertyPriceMainContent />}
                    stepNumber={10}
                />
            </Div>
        </Div>
    );
};

export default PropertyPricePage;
