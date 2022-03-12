import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BookedRoom from '../components/booked_rooms/BookedRooms';
import Header from '../components/Header';
import {
    fetchBookedRooms,
    fetchWishlistsIDsOfCurrentUser,
    userState,
} from '../features/user/userSlice';
import { Image } from '../globalStyle';
import { getImage } from '../helpers';

import './css/booked_rooms.css';

interface IBookedRoomsPageProps {}

const BookedRoomsPage: FC<IBookedRoomsPageProps> = () => {
    const dispatch = useDispatch();
    const { bookedRooms, ratingLabels } = useSelector(userState);

    useEffect(() => {
        dispatch(fetchBookedRooms({ query: '' }));
        dispatch(fetchWishlistsIDsOfCurrentUser());
    }, []);

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            <div
                style={{ minHeight: '100vh' }}
                className='p-relative'
                id='user-bookings__mainContainer'
            >
                <div>
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
                        {bookedRooms.map(bookedRoom => (
                            <BookedRoom
                                booking={bookedRoom}
                                ratingLabels={ratingLabels}
                                key={bookedRoom.bookingId}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookedRoomsPage;
