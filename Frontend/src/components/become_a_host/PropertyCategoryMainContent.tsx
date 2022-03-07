import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import { RootState } from '../../store';
import './css/category_main_content.css';

interface IPropertyCategoryMainContentProps {}

const PropertyCategoryMainContent: FC<IPropertyCategoryMainContentProps> = () => {
    const { categories } = useSelector((state: RootState) => state.category);

    return (
        <>
            <div id='room-category__mainContainer'>
                {categories.map(category => (
                    <div className='category__box' key={category.id}>
                        <input type='hidden' value={category.id} />
                        <div className='flex-space'>
                            <div className='content__box--name'>{category.name}</div>
                            <Image src={getImage(category.iconPath)} size='32px' />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PropertyCategoryMainContent;
