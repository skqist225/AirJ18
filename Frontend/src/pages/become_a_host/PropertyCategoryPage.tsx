import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    LeftPageContent,
    PropertyCategoryMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import { fetchCategories } from '../../features/category/categorySlice';
import { Div } from '../../globalStyle';

interface IPropertyCategoryPageProps {}

const PropertyCategoryPage: FC<IPropertyCategoryPageProps> = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCategories());
    }, []);

    return (
        <>
            <Div height='100vh'>
                <Div className='flex'>
                    <LeftPageContent
                        background='/images/property_type.jpg'
                        title='Điều nào sau đây mô tả chính xác nhất về nơi ở của bạn?'
                    />
                    <RightPageContent
                        MainContent={<PropertyCategoryMainContent />}
                        nextPage='privacy-type'
                        stepNumber={2}
                    />
                </Div>
            </Div>
        </>
    );
};

export default PropertyCategoryPage;
