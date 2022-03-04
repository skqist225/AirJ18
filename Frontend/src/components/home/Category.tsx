import { FC, useEffect } from 'react';
import { ICategory } from './HomeCategories';
import $ from 'jquery';
import { useDispatch } from 'react-redux';
import { fetchRoomsByCategoryId } from '../../features/room/roomSlice';

interface ICategoryProps {
    category: ICategory;
    index: number;
}

export const Category: FC<ICategoryProps> = ({ category, index }) => {
    const dispatch = useDispatch();

    const jQuerycode = async () => {
        const catContainers = $('.cat__container');
        const categoryid =
            parseInt(new URLSearchParams(window.location.search).get('categoryid')!) || 1;

        $('.img_idt').each(function () {
            if (parseInt($(this).data('index')) === 1) $(this).addClass('active');
        });

        catContainers.each(function () {
            if (parseInt($(this).data('category-id')) === categoryid) {
                setActiveTab(catContainers, $(this));
                dispatch(fetchRoomsByCategoryId({ categoryid }));
            }
        });

        function setActiveTab(catContainer: JQuery<HTMLElement>, self: JQuery<HTMLElement>) {
            catContainer.each(function () {
                $(this).removeClass('active');

                const insideLoopimage = $('.cat__image', this);
                insideLoopimage.removeClass('active');
            });

            $(self).addClass('active');
            $('.cat__image', self).addClass('active');
        }
    };

    useEffect(() => {
        jQuerycode();
    }, []);

    return (
        <div className='cat__container' data-category-id={category.id}>
            <button
                id={`${index + 1}`}
                className='button__container'
                onClick={e => {
                    e.preventDefault();
                    window.location.href = `/?categoryid=${category.id}`;
                }}
            >
                <div>
                    <img
                        src={`${process.env.REACT_APP_SERVER_URL}${category.icon}`}
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
