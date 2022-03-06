import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getImage } from '../../helpers/getImage';
import { RootState } from '../../store';
import { Category } from './Category';
import { IncAndDecBtn } from '../../components/hosting/listings/IncAndDecBtn';
import { Div, Image } from '../../globalStyle';
import $ from 'jquery';

export interface ICategory {
    name: string;
    icon: string;
    id: number;
}

interface IHomeCategoriesProps {
    categories: Array<ICategory>;
}

export const HomeCategories: FC<IHomeCategoriesProps> = ({ categories }) => {
    const jQueryCode = () => {
        $('.listings__minus-btn').attr('disabled', 'true');
        const maxModifyInput = $('#max-input__modify');
        const minModifyInput = $('#min-input__modify');
        const roomPriceRange = $('#roomPriceRange');

        maxModifyInput.val(roomPriceRange.attr('max')!);
        minModifyInput.val(parseInt(roomPriceRange.attr('min')! as string));

        maxModifyInput.on('change', function () {
            roomPriceRange.attr('max', parseInt($(this).val()! as string));
        });

        minModifyInput.on('change', function () {
            roomPriceRange.attr('min', parseInt($(this).val() as string));
        });

        $('.incAndDecBtn').each(function () {
            $(this).on('click', function () {
                const spanInfoTag = $(this).siblings(`#${$(this).data('edit')}`);
                let spanValue = parseInt(spanInfoTag.text()! as string);
                const dataFunction = $(this).data('function');
                const deleteButton = $('.deleteBtn.' + $(this).data('trigger'));
                const applyButton = $('.applyBtn.' + $(this).data('trigger'));
                const self = $(this);

                if (dataFunction === 'dec') {
                    if (spanValue > 0) {
                        if (spanValue === 1) $(this).attr('disabled', 'true');
                        spanInfoTag.text(--spanValue);
                    }
                    let countZero = 0;
                    if (spanValue === 0)
                        $('.listings__minus-btn').each(function () {
                            if (!$(this).is(self)) {
                                const spanValue = parseInt(
                                    $(this)
                                        .siblings(`#${$(this).data('edit')}`)
                                        .text()! as string
                                );
                                if (spanValue === 0) countZero++;
                            }
                        });

                    if (countZero === $('.listings__minus-btn').length - 1)
                        deleteButton.attr('disabled', 'true');
                }

                if (dataFunction === 'inc') {
                    if (spanValue === 0)
                        $(this)
                            .siblings(`.listings__minus-btn.incAndDecBtn`)
                            .removeAttr('disabled');
                    spanInfoTag.text(++spanValue);

                    if (spanValue > 0) deleteButton.removeAttr('disabled');
                }
            });
        });

        $('#index__filter-btn').click(function () {
            $(this).click(function () {
                const categoryId = new URLSearchParams(window.location.search).get('categoryId');

                let choosenPrivacy: number[] = [];
                $('input[name="privacyFilter"]:checked').each(function () {
                    choosenPrivacy.push(parseInt($(this).val()! as string));
                });

                const minPrice = ($('#min-input__modify').val() as string).replace(/\./g, '');
                const maxPrice = $('#max-input__modify').val();

                const bedRoomCount = parseInt($('#listings__bed-room-count').text()! as string);
                const bedCount = parseInt($('#listings__bed-count').text()! as string);
                const bathRoomCount = parseInt($('#listings__bath-room-count').text()! as string);

                const selectedAmentities: number[] = [];
                $('input[class="amentitySelected"]:checked').each(function () {
                    selectedAmentities.push(parseInt($(this).val() as string));
                });

                window.location.href = `${
                    window.location.href
                }?categoryId=${categoryId}&privacies=${choosenPrivacy.join(
                    ' '
                )}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedRoom=${bedRoomCount}&bed=${bedCount}&bathRoom=${bathRoomCount}&amentities=${selectedAmentities.join(
                    ' '
                )}`;
            });
        });
    };

    function displayEditThumbnailBox() {
        $('#chooseRoomThumbnail').css('display', 'block');
        $('#home__mainContainer').addClass('remove-scroll');
    }

    return (
        <div className='flex' style={{ marginBottom: '25px' }}>
            <div className='flex f1' style={{ maxWidth: '80%' }}>
                {categories.length > 0 &&
                    categories.map((category: ICategory, index: number) => {
                        return (
                            <Category
                                category={category}
                                index={index}
                                key={category.name + '-' + category.id}
                            />
                        );
                    })}
            </div>
            <div className='f1 normal-flex' style={{ maxWidth: '20%', justifyContent: 'flex-end' }}>
                <div>
                    <button className='filterButton' onClick={() => displayEditThumbnailBox()}>
                        <span>
                            <Image src={getImage('/svg/filter.svg')} size='16px' />
                        </span>
                        <span className='inline-block fs-14'>Bộ lọc</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
