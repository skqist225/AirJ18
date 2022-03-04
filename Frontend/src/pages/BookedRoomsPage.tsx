import { FC } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Image } from '../globalStyle';
import { getImage } from '../helpers/getImage';
import './css/booked_rooms.css';

interface IBookedRoomsPageProps {}

const BookedRoomsPage: FC<IBookedRoomsPageProps> = () => {
    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            <div style={{ minHeight: '100vh' }} className='p-relative'>
                <main>
                    <div id='user-bookings__container'>
                        <div style={{ textAlign: 'center' }}>
                            {/* <span
                                style={{color: 'green'}}
                                th:if="${cancelMessage == 'Hủy đặt phòng thành công'}"
                            >
                                [[${cancelMessage}]]
                            </span>
                            <span
                                style='color: red'
                                th:if="${cancelMessage == 'Hủy đặt phòng thất bại'}"
                            >
                                [[${cancelMessage}]]
                            </span> */}
                        </div>
                        <div className='normal-flex f1' id='user-bookings__search-container'>
                            <div
                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                // onclick='filterBookings();'
                            >
                                <Image src={getImage('/svg/search.svg')} size='20px' />
                            </div>
                            <input
                                type='text'
                                className='w-100'
                                placeholder='Tìm kiếm theo tên phòng, tên chủ nhà'
                                id='user-bookings__search-input'
                            />
                            <div>
                                <Link to={'/user/bookings'}>
                                    <button
                                        style={{ width: '100px' }}
                                        className='fs-14 fw-600 transparent__btn'
                                    >
                                        Xóa tìm kiếm
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <th:block th:each='booking : ${bookings}'></th:block>
                    </div>
                </main>
            </div>
        </>
    );
};

export default BookedRoomsPage;
