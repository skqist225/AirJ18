import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchUserOwnedRoom } from '../../features/room/roomSlice';
import { getPageNumber } from '../../helpers';

import $ from 'jquery';
import './css/filter_footer.css';

interface IFilterFooterProps {
    footerOf: string;
}

const FilterFooter: FC<IFilterFooterProps> = ({ footerOf }) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    useEffect(() => {
        $('.applyBtn').each(function () {
            $(this)
                .off('click')
                .on('click', function () {
                    const dataModify = $(this).data('modify');

                    switch (dataModify) {
                        case 'roomAndBedRoom': {
                            let bathRooms = 0;
                            let bedRooms = 0;
                            let beds = 0;
                            const query = $('#listings__search-input').val()!.toString().trim();

                            $('.listings__minus-btn').each(function () {
                                const dataEdit = $(this).data('edit');
                                const spanValue = $(this).siblings(`#${dataEdit}`).text();

                                if (dataEdit === 'listings__bath-room-count')
                                    bathRooms = parseInt(spanValue);
                                else if (dataEdit === 'listings__bed-room-count')
                                    bedRooms = parseInt(spanValue);
                                else beds = parseInt(spanValue);
                            });

                            console.log(bathRooms);
                            console.log(bedRooms);
                            console.log(beds);

                            dispatch(
                                fetchUserOwnedRoom({
                                    pageNumber: getPageNumber(pathname),
                                    query,
                                    bathRooms,
                                    bedRooms,
                                    beds,
                                })
                            );
                            break;
                        }
                        case 'amenities': {
                            let amentitiesID: number[] = [];

                            $('.amenity').each(function () {
                                if ($(this).children('span').hasClass('ant-checkbox-checked')) {
                                    amentitiesID.push(
                                        parseInt($(this).children().children().val() as string)
                                    );
                                }
                            });

                            dispatch(
                                fetchUserOwnedRoom({
                                    pageNumber: getPageNumber(pathname),
                                    amenityIDs: amentitiesID.join(' '),
                                })
                            );

                            break;
                        }
                        case 'status': {
                            let statuses: string[] = [];
                            $('.statusSelected').each(function () {
                                if ($(this).children('span').hasClass('ant-checkbox-checked')) {
                                    statuses.push($(this).children().children().val() as string);
                                }
                            });

                            dispatch(
                                fetchUserOwnedRoom({
                                    pageNumber: getPageNumber(pathname),
                                    statuses: statuses.join(' '),
                                })
                            );
                            break;
                        }
                    }
                });
        });
    }, []);

    return (
        <div className='filter--footer__container'>
            <div className='flex'>
                <div>
                    <button
                        className={'filter--footer__transparentBtn deleteBtn ' + footerOf}
                        data-modify={footerOf}
                        disabled
                    >
                        Xóa
                    </button>
                </div>
                <div>
                    <button
                        className={'filter--footer__applyBtn applyBtn ' + footerOf}
                        data-modify={footerOf}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterFooter;
