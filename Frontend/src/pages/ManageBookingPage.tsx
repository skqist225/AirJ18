import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookingsTable, FilterFooter } from '../components/booking';
import Header from '../components/Header';
import { fetchBookingListOfCurrentUserRooms } from '../features/booking/bookingSlice';
import { Div, Image } from '../globalStyle';
import { getImage } from '../helpers';
import { RootState } from '../store';

import './css/manage_booking_page.css';

interface IManageBookingPageProps {}

const ManageBookingPage: FC<IManageBookingPageProps> = () => {
    const dispatch = useDispatch();
    const page = (window.location.href as string).includes('?')
        ? window.location.href.split('?')[0].split('/').pop()!
        : window.location.href.split('/').pop()!;

    useEffect(() => {
        dispatch(fetchBookingListOfCurrentUserRooms({ page: parseInt(page) }));
    }, []);

    const { bookingsOfCurrentUserRooms, totalElements } = useSelector(
        (state: RootState) => state.booking
    );

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />

            <div id='booking--listings__mainContainer'>
                <div className='listings__container'>
                    <div className='listings__header flex'>
                        <div className='listings__header-rooms-length'>
                            {totalElements} đơn đặt phòng
                        </div>
                    </div>
                    <div className='listings__filter-container'>
                        <div className='listings__search-room'>
                            <div
                                className='listings__search-icon-container'
                                // onclick='filterBookingByInput();'
                            >
                                <Image src={getImage('/svg/search.svg')} size='12px' />
                            </div>
                            <div className='f1'>
                                <input
                                    type='text'
                                    placeholder='Tìm kiếm lịch đặt phòng theo mã, tên phòng'
                                    id='listings__search-input'
                                />
                            </div>
                        </div>
                        <div className='listings__filter'>
                            <button
                                className='listings__filter-option'
                                data-dropdown='listings__filter-roomAndBedRoom'
                            >
                                <span>Ngày đặt phòng</span>
                                <div className='listings__filter-img-container'>
                                    <Image src={getImage('/svg/dropdown.svg')} size='12px' />
                                </div>
                            </button>
                            <div id='listings__filter-roomAndBedRoom'>
                                <div className='listings__filter-wrapper'>
                                    <div className='filter-box'>
                                        <div className='normal-flex listings__filter-status-row h-100'>
                                            <input
                                                type='date'
                                                className='form-control'
                                                id='bookingDateInput'
                                            />
                                        </div>
                                    </div>
                                    <FilterFooter footerOf='bookingDate' />
                                </div>
                            </div>
                        </div>
                        <div className='listings__filter'>
                            <button
                                className='listings__filter-option'
                                data-dropdown='listings__filter-amentities'
                            >
                                <span>Tìm kiếm theo tháng/năm</span>
                                <div className='listings__filter-img-container'>
                                    <Image src={getImage('/svg/dropdown.svg')} size='12px' />
                                </div>
                            </button>
                            <Div
                                id='listings__filter-amentities'
                                height='400px'
                                className='overflow-hidden'
                            >
                                <Div className='filter-box' height='80%'>
                                    <div>
                                        <label className='form-label'>Tháng: </label>
                                        <input
                                            type='text'
                                            placeholder='Tháng'
                                            className='form-control mb-5'
                                            id='bookingDateMonthInput'
                                            pattern='^[1-12]{1,2}$'
                                            minLength={1}
                                            maxLength={2}
                                        />
                                    </div>
                                    <div>
                                        <label className='form-label'>Năm: </label>
                                        <input
                                            type='text'
                                            placeholder='Năm'
                                            className='form-control'
                                            id='bookingDateYearInput'
                                            pattern='^[0-9]+'
                                            minLength={4}
                                            maxLength={4}
                                        />
                                    </div>
                                </Div>
                                <FilterFooter footerOf='bookingDateByMonthAndYear' />
                            </Div>
                        </div>
                        <div className='listings__filter'>
                            <button
                                className='listings__filter-option'
                                data-dropdown='listings__filter-status'
                            >
                                <span>Trạng thái lịch đặt phòng</span>
                                <div className='listings__filter-img-container'>
                                    <Image src={getImage('/svg/dropdown.svg')} size='12px' />
                                </div>
                            </button>
                            <div id='listings__filter-status'>
                                <div className='listings__filter-wrapper'>
                                    <div style={{ padding: '24px' }} className='f1'>
                                        <div className='normal-flex listings__filter-status-row'>
                                            <input
                                                type='checkbox'
                                                className='isCompleteSelected'
                                                value='1'
                                            />
                                            <div>Hoàn tất</div>
                                        </div>
                                        <div className='normal-flex listings__filter-status-row'>
                                            <input
                                                type='checkbox'
                                                className='isCompleteSelected'
                                                value='0'
                                            />
                                            <div>Phê duyệt</div>
                                        </div>
                                        <div className='normal-flex listings__filter-status-row'>
                                            <input
                                                type='checkbox'
                                                className='isCompleteSelected'
                                                value='2'
                                            />
                                            <div>Đã hủy</div>
                                        </div>
                                    </div>
                                    <FilterFooter footerOf='isComplete' />
                                </div>
                            </div>
                        </div>
                        <div className='listings__filter'>
                            <button
                                className='listings__filter-option'
                                data-dropdown='listings__filter-others'
                            >
                                <span>Tổng phí</span>
                                <div className='listings__filter-img-container'>
                                    <Image src={getImage('/svg/dropdown.svg')} size='12px' />
                                </div>
                            </button>
                            <div id='listings__filter-others'>
                                <div className='listings__filter-wrapper'>
                                    <div className='filter-box overflow-hidden'>
                                        <div className='normal-flex listings__filter-others-row'>
                                            <input
                                                type='range'
                                                className='form-range form-control w-100'
                                                id='totalFeeRangeInput'
                                                min={0}
                                                // onchange='updateTextInput(this.value);'
                                                step='1000000'
                                            />
                                        </div>
                                        <div className='normal-flex listings__filter-others-row'>
                                            <input
                                                type='text'
                                                id='textInput'
                                                value=''
                                                className='form-control'
                                            />
                                        </div>
                                    </div>
                                    <FilterFooter footerOf='totalFee' />
                                </div>
                            </div>
                        </div>
                        <div className='listings__filter'>
                            <button
                                className='listings__filter-option deleteAllFilterOption'
                                data-dropdown='listings__filter-others'
                            >
                                <span>Xóa toàn bộ bộ lọc</span>
                            </button>
                        </div>
                    </div>
                    <div className='f1'>
                        <BookingsTable bookings={bookingsOfCurrentUserRooms} />
                    </div>
                    <div className='pagination'>
                        <a data-page='prev'>&laquo;</a>
                        <a data-page='1' className='active listings__link'>
                            1
                        </a>
                        <a data-page='2' className='listings__link'>
                            2
                        </a>
                        <a data-page='3' className='listings__link'>
                            3
                        </a>
                        <a data-page='4' className='listings__link'>
                            4
                        </a>
                        <a data-page='5' className='listings__link'>
                            5
                        </a>
                        <a data-page='6' className='listings__link'>
                            6
                        </a>
                        <a data-page='next'>&raquo;</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageBookingPage;
