import { FC } from 'react';

interface IPropertyCategoryPartialProps {}

const PropertyCategoryPartial: FC<IPropertyCategoryPartialProps> = () => {
    return (
        <>
            <div className='col-flex'>
                {/* <div th:each='category : ${categories}' className='room-type__box'>
                    <input type='hidden' th:value='${category.id}' />
                    <div className='flex-space'>
                        <div className='room-type__name'>[[${category.name}]]</div>
                        <img th:src='${category.iconPath}' width='32px' height='32px' />
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default PropertyCategoryPartial;
