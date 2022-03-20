import React, { FC, useEffect } from 'react';
import $ from 'jquery';
import { useDispatch } from 'react-redux';
import { fetchRoomsByCategoryAndConditions } from '../../features/room/roomSlice';
import { ICategory } from '../../features/category/categorySlice';
import { getImage } from '../../helpers';

interface ICategoryProps {
    category: ICategory;
    index: number;
    setCurrentCategory: React.Dispatch<React.SetStateAction<number>>;
}

export const Category: FC<ICategoryProps> = ({ category, index, setCurrentCategory }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const catContainers = $('.cat__container');
        catContainers.each(function () {
            if (parseInt($(this).data('category-id')) === 1) {
                setActiveTab(catContainers, $(this));
            }
        });
    }, []);

    function setActiveTab(catContainers: JQuery<HTMLElement>, tabNeedActive: JQuery<HTMLElement>) {
        catContainers.each(function () {
            $(this).removeClass('active');

            const insideLoopimage = $('.cat__image', this);
            insideLoopimage.removeClass('active');
        });
        setCurrentCategory(tabNeedActive.data('category-id'));
        tabNeedActive.addClass('active');
        $('.cat__image', tabNeedActive).addClass('active');
    }

    function fetchNewRoomsByCategory(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const catContainers = $('.cat__container');
        const self = $(event.currentTarget);

        dispatch(fetchRoomsByCategoryAndConditions({ categoryid: self.data('category-id') }));
        setActiveTab(catContainers, self.parent('.cat__container'));
    }

    return (
        <div className='cat__container' data-category-id={category.id}>
            <button
                id={`${index + 1}`}
                className='button__container'
                onClick={fetchNewRoomsByCategory}
                data-category-id={category.id}
            >
                <div>
                    <img
                        src={getImage(category.icon)}
                        alt={category.name + "'s icon"}
                        className='cat__image'
                    />
                </div>
                <div className='cat__name'>{category.name}</div>
                <input type='hidden' value={category.id} className='cat__id' />
            </button>
        </div>
    );
};
