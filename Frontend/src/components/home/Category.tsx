import React, { FC, useEffect } from 'react';
import { ICategory } from './HomeCategories';
import $ from 'jquery';
import './home.css';

interface ICategoryProps {
    category: ICategory;
    index: number;
}

export const Category: FC<ICategoryProps> = ({ category, index }) => {
    const jQuerycode = async () => {
        const catContainers = $('.cat__container');
        const buttonContainers = $('.button__container');
        const urlSearchParams = new URLSearchParams(window.location.search).get('categoryId');
        let categoryId = urlSearchParams || 1;

        $('.img_idt').each(function () {
            if ($(this).data('index') * 1 === 1) $(this).addClass('active');
        });

        catContainers.each(function () {
            if ($(this).data('category-id') * 1 === categoryId)
                setActiveTab(catContainers, $(this));
        });

        buttonContainers.each(function () {
            $(this).on('click', function () {
                window.location.href = `/?categoryId=${$(this).data('category-id')}`;
            });
        });
    };

    function setActiveTab(catContainer: JQuery<HTMLElement>, self: JQuery<HTMLElement>) {
        const imageClassName = '.' + 'cat__image';

        catContainer.each(function () {
            $(this).removeClass('active');

            const insideLoopimage = $(imageClassName, this);
            insideLoopimage.removeClass('active');
        });

        $(self).addClass('active');
        const image = $(imageClassName, self);
        image.addClass('active');
    }

    useEffect(() => {
        jQuerycode();
    }, []);

    return (
        <div className='cat__container' data-category-id={category.id}>
            <button
                className='button__container'
                id={index + 1 + ''}
                data-category-id={category.id}
            >
                <div>
                    <img
                        src={`http://localhost:8080${category.icon}`}
                        alt={category.name + "'s icon"}
                        width='20px'
                        height='20px'
                        className='cat__image'
                    />
                </div>
                <div className='cat__name'>{category.name}</div>
                <input type='hidden' value={category.id} className='cat__id' />
            </button>
        </div>
    );
};
