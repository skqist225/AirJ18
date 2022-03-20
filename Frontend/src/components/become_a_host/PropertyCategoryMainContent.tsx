import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers';
import { categoryState } from '../../features/category/categorySlice';
import $ from 'jquery';

import './css/category_main_content.css';

interface IPropertyCategoryMainContentProps {}

const PropertyCategoryMainContent: FC<IPropertyCategoryMainContentProps> = () => {
    const { categories } = useSelector(categoryState);

    useEffect(() => {
        const categoryBox = $('.category__box');

        if (localStorage.getItem('room')) {
            const { category } = JSON.parse(localStorage.getItem('room')!);
            categoryBox.each(function () {
                if ($(this).data('category-id') === category) {
                    $(this).addClass('active');
                }
            });
        }

        categoryBox.each(function () {
            $(this).on('click', function () {
                categoryBox.each(function () {
                    $(this).removeClass('active');
                });

                $(this).addClass('active');
            });
        });
    }, [categories]);

    return (
        <>
            <div id='room-category__mainContainer'>
                {categories.map(category => (
                    <div className='category__box' key={category.id} data-category-id={category.id}>
                        <div className='flex-space'>
                            <div className='content__box--name'>{category.name}</div>
                            <Image src={getImage(category.icon)} size='32px' />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PropertyCategoryMainContent;
