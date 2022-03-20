import React, { FC, useState } from 'react';
import { getImage } from '../../helpers';
import { Category } from './Category';
import { Image } from '../../globalStyle';
import { categoryState, ICategory } from '../../features/category/categorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomsByCategoryAndConditions } from '../../features/room/roomSlice';
import $ from 'jquery';
import FilterTimeBox from './FilterTimeBox';

interface IHomeCategoriesProps {}

export const HomeCategories: FC<IHomeCategoriesProps> = ({}) => {
    const dispatch = useDispatch();
    const [isMoreCategoryClicked, setIsMoreCategoryClicked] = useState(false);
    const [isTimeFilterClicked, setIsTimeFilterClicked] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(1);
    const { categories, loading: categoryLoading } = useSelector(categoryState);

    function displayEditThumbnailBox() {
        $('#chooseRoomThumbnail').css('display', 'block');
        $('#home__mainContainer').addClass('remove-scroll');
    }

    function closeMoreCategoryBox() {
        $('#home__moreCategory').css('display', 'none');
        setIsMoreCategoryClicked(false);
    }

    function setActiveTab(catContainers: JQuery<HTMLElement>, tabNeedActive: JQuery<HTMLElement>) {
        catContainers.each(function () {
            $(this).removeClass('active');

            const insideLoopimage = $('.cat__image', this);
            insideLoopimage.removeClass('active');
        });

        tabNeedActive.addClass('active');
        $('.cat__image', tabNeedActive).addClass('active');
    }

    function setLastItem(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        const self = $(event.currentTarget!);
        $('#getMoreCategoryBtn').text(self.text());

        setCurrentCategory(self.data('category-id'));
        dispatch(fetchRoomsByCategoryAndConditions({ categoryid: self.data('category-id') }));
        const addMoreIcon = $('#addMoreIcon');
        addMoreIcon.addClass('active');
        addMoreIcon.attr('src', getImage(self.data('category-icon')));

        const catContainers = $('.cat__container');
        setActiveTab(catContainers, self.parent().parent().parent());

        closeMoreCategoryBox();
    }

    function displayTimeSelect(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const self = $(event.currentTarget);
        if (!isTimeFilterClicked) {
            $('#filterTime__box').css('display', 'block');
            setIsTimeFilterClicked(true);
        } else {
            $('#filterTime__box').css('display', 'none');
            setIsTimeFilterClicked(false);
        }
    }

    function displayMoreCategory() {
        if (!isMoreCategoryClicked) {
            $('#home__moreCategory').css('display', 'block');
            setIsMoreCategoryClicked(true);
        } else {
            closeMoreCategoryBox();
        }
    }

    return (
        <>
            {!categoryLoading && (
                <div className='flex' style={{ marginBottom: '25px', marginTop: '10px' }}>
                    <div className='normal-flex f1' style={{ maxWidth: '60%' }}>
                        {categories.length > 0 &&
                            categories.map((category: ICategory, index: number) => {
                                if (index > 7) {
                                    return null;
                                }

                                return (
                                    <Category
                                        category={category}
                                        index={index}
                                        key={category.name + '-' + category.id}
                                        setCurrentCategory={setCurrentCategory}
                                    />
                                );
                            })}
                        <div className='cat__container p-relative'>
                            <div className='normal-flex'>
                                <div>
                                    <img id='addMoreIcon' className='cat__image' src='' />
                                </div>
                                <button
                                    className='button__container normal-flex'
                                    id='getMoreCategoryBtn'
                                    style={{ justifyContent: 'center' }}
                                    onClick={displayMoreCategory}
                                >
                                    <div
                                        className='cat__name normal-flex'
                                        style={{ marginRight: '5px' }}
                                    >
                                        Thêm
                                    </div>
                                    <div>
                                        <Image src={getImage('/svg/dropdown.svg')} size='10px' />
                                    </div>
                                </button>
                            </div>

                            <div id='home__moreCategory'>
                                <ul>
                                    {categories.length > 0 &&
                                        categories.map((category: ICategory, index: number) => {
                                            if (index <= 7) {
                                                return null;
                                            }

                                            return (
                                                <li
                                                    data-category-id={category.id}
                                                    data-category-icon={category.icon}
                                                    key={category.name + '-' + category.id}
                                                    onClick={setLastItem}
                                                >
                                                    {category.name}
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div
                        className='f1 normal-flex'
                        style={{ maxWidth: '20%', justifyContent: 'flex-end' }}
                    >
                        <div className='p-relative mr-10'>
                            <button
                                className='filterButton'
                                onClick={displayTimeSelect}
                                id='selectFilterTimeBtn'
                            >
                                <span className='inline-block fs-14'>Bất cứ lúc nào</span>{' '}
                                <span style={{ display: 'inline-flex', justifyContent: 'center' }}>
                                    <Image src={getImage('/svg/dropdown.svg')} size='12px' />
                                </span>
                            </button>

                            <FilterTimeBox
                                categoryid={currentCategory}
                                triggerButton={$('#selectFilterTimeBtn')}
                            />
                        </div>
                        <div>
                            <button className='filterButton' onClick={displayEditThumbnailBox}>
                                <span>
                                    <Image src={getImage('/svg/filter.svg')} size='16px' />
                                </span>
                                <span className='inline-block fs-14'>Bộ lọc</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
