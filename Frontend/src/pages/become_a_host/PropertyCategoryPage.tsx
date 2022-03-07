import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LeftPageContent } from '../../components/become_a_host';
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

                    {/* <div className='room-group__right'>
                        <div className='room-group__right-first'></div>
                        <div className='room-group__right-middle'>
                            <PropertyCategoryPartial />
                        </div>
                        <div className='stepProcess room-group-step'></div>
                        <div className='room-group__right-last'>
                            <div>
                                <a
                                    th:href='@{/become-a-host/property-type-group}'
                                    className='room-group__prev-step'
                                    style='
                                    text-decoration: none;
                                    text-decoration: underline;
                                    color: #000;
                                '
                                >
                                    Quay lại
                                </a>
                            </div>
                            <button className='become-a-host__right-startBtn' onclick='nextPage();'>
                                <span style='font-weight: 500'>Tiếp theo</span>
                            </button>
                        </div>
                    </div> */}
                </Div>
            </Div>
        </>
    );
};

export default PropertyCategoryPage;
