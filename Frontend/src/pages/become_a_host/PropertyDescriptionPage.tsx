import { FC } from 'react';
import {
    LeftPageContent,
    PropertyDescriptionMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import { Div } from '../../globalStyle';

interface IPropertyTitlePageProps {}

const PropertyTitlePage: FC<IPropertyTitlePageProps> = () => {
    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background=''
                    title='Bây giờ, hãy mô tả chỗ ở của bạn'
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
                    nextPage='price'
                    MainContent={<PropertyDescriptionMainContent />}
                    stepNumber={9}
                />
            </Div>
        </Div>
    );
};

export default PropertyTitlePage;
