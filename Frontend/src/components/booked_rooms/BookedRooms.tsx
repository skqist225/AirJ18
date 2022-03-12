import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Div, Image } from '../../globalStyle';
import { callToast, getImage } from '../../helpers';
import { IBookedRoom, IRatingLabel } from '../../type/user/type_User';
import { MyNumberForMat } from '../utils';
import { addClickEventForLoveButton } from '../home/script/add_to_wishlists';
import { userState } from '../../features/user/userSlice';
import initComp from './script';
import Toast from '../notify/Toast';

import $ from 'jquery';

interface IBookedRoomProps {
    booking: IBookedRoom;
    ratingLabels: IRatingLabel[];
}

const BookedRoom: FC<IBookedRoomProps> = ({ booking, ratingLabels }) => {
    const { wishlistsIDs, user, wishlistsIDsFetching } = useSelector(userState);
    const [ratingComment, setRatingComment] = useState(booking.bookingReview);
    const [cleanlinessRating, setCleanlinessRating] = useState(0);
    const [accuracyRating, setAccuracyRating] = useState(0);
    const [contactRating, setContactRating] = useState(0);
    const [locationRating, setLocationRating] = useState(0);
    const [checkinRating, setCheckinRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);

    // let cleanlinessRating = 0;
    // let accuracyRating = 0;
    // let contactRating = 0;
    // let locationRating = 0;
    // let checkinRating = 0;
    // let valueRating = 0;

    function reviewSubmit(self: JQuery<HTMLElement>) {
        if (!ratingComment) {
            callToast('warning', 'Vui lòng để lại bình luận!');
            return;
        }

        window.location.href = `${window.location.origin}/user/rating/${self.data(
            'booking-id'
        )}?cleanlinessRating=${cleanlinessRating}&contactRating=${contactRating}&checkinRating=${checkinRating}&accuracyRating=${accuracyRating}&locationRating=${locationRating}&valueRating=${valueRating}&comment=${ratingComment}`;
    }

    function displayEditThumbnailBox(self: JQuery<HTMLElement>) {
        //find matching booking id and open up review section.
        $('.chooseRoomThumbnail').each(function () {
            if (parseInt($(this).data('booking-id')) === parseInt(self.data('booking-id'))) {
                $(this).addClass('active');
                $('#user-bookings__mainContainer').addClass('unactive');
            }
        });

        $('.ratingContainer', '.chooseRoomThumbnail.active').each(function () {
            const cleanliness = parseInt($(this).data('rating-cleanliness'));
            const contact = parseInt($(this).data('rating-contact'));
            const checkin = parseInt($(this).data('rating-checkin'));
            const accuracy = parseInt($(this).data('rating-accuracy'));
            const location = parseInt($(this).data('rating-location'));
            const value = parseInt($(this).data('rating-value'));

            setCleanlinessRating(cleanliness);
            setContactRating(contact);
            setCheckinRating(checkin);
            setAccuracyRating(accuracy);
            setLocationRating(location);
            setValueRating(value);

            $('.ratingStarContainer').each(function () {
                const children = $(this).children();
                const label = $(this).data('label');

                switch (label) {
                    case 'Mức độ sạch sẽ': {
                        children.each(function () {
                            const svg = $(this).children('svg');
                            if (
                                $(this).children('.ratingStar').data('star-value') * 1 <=
                                cleanlinessRating
                            )
                                $(this).children('.ratingStar').addClass('selected');
                        });
                        break;
                    }
                    case 'Độ chính xác': {
                        children.each(function () {
                            const svg = $(this).children('svg');
                            if (
                                $(this).children('.ratingStar').data('star-value') * 1 <=
                                accuracyRating
                            )
                                $(this).children('.ratingStar').addClass('selected');
                        });
                        break;
                    }
                    case 'Liên lạc': {
                        children.each(function () {
                            const svg = $(this).children('svg');
                            if (
                                $(this).children('.ratingStar').data('star-value') * 1 <=
                                contactRating
                            )
                                $(this).children('.ratingStar').addClass('selected');
                        });
                        break;
                    }
                    case 'Vị trí': {
                        children.each(function () {
                            const svg = $(this).children('svg');
                            if (
                                $(this).children('.ratingStar').data('star-value') * 1 <=
                                locationRating
                            )
                                $(this).children('.ratingStar').addClass('selected');
                        });
                        break;
                    }
                    case 'Nhận phòng': {
                        children.each(function () {
                            const svg = $(this).children('svg');
                            if (
                                $(this).children('.ratingStar').data('star-value') * 1 <=
                                checkinRating
                            )
                                $(this).children('.ratingStar').addClass('selected');
                        });
                        break;
                    }
                    case 'Giá trị': {
                        children.each(function () {
                            const svg = $(this).children('svg');
                            if (
                                $(this).children('.ratingStar').data('star-value') * 1 <=
                                valueRating
                            )
                                $(this).children('.ratingStar').addClass('selected');
                        });
                        break;
                    }
                }
            });
        });
    }

    useEffect(() => {
        initComp(
            setCleanlinessRating,
            setAccuracyRating,
            setContactRating,
            setLocationRating,
            setCheckinRating,
            setValueRating,
            setRatingComment,
            ratingComment
        );
    }, []);

    useEffect(() => {
        if (!wishlistsIDsFetching) addClickEventForLoveButton(wishlistsIDs, user);
    }, [wishlistsIDsFetching, user]);

    function hideEditThumbnailBox() {
        $('.chooseRoomThumbnail').removeClass('active');
        $('#user-bookings__mainContainer').removeClass('unactive');
    }

    return (
        <>
            <div className='user-bookings__booking-box'>
                <div className='box-padding'>
                    <Div className='flex-space' padding='0 0 10px 0'>
                        <div className='normal-flex'>
                            <div>
                                <button
                                    className='user-bookings__add-to-fav-btn room__likeBtn'
                                    data-room-id={booking.roomId}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        aria-hidden='true'
                                        focusable='false'
                                        role='presentation'
                                        viewBox='0 0 32 32'
                                        style={{
                                            display: 'block',
                                            fill: 'none',
                                            height: '16px',
                                            width: '16px',
                                            stroke: 'currentcolor',
                                            strokeWidth: 2,
                                            overflow: 'visible',
                                        }}
                                        className='heartSvg'
                                    >
                                        <path d='m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z'></path>
                                    </svg>
                                    <span style={{ marginLeft: '5px' }} className='inline-block'>
                                        Yêu thích
                                    </span>
                                </button>
                            </div>
                            <Div className='normal-flex' margin='0 0 0 10px'>
                                <Div width='40px' height='40px'>
                                    <img
                                        src={getImage(booking.hostAvatar)}
                                        alt=''
                                        className='w100-h100 rounded-border of-c'
                                    />
                                </Div>
                                <div className='user-bookings__customer-name'>
                                    {booking.hostName}
                                </div>
                            </Div>
                        </div>
                        <div>
                            {booking.complete === true && booking.refund === false && (
                                <div
                                    style={{
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: 'rgb(203 244 201)',
                                    }}
                                >
                                    <span style={{ color: 'rgba(14, 98, 69, 1)' }}>
                                        <svg
                                            aria-hidden='true'
                                            className='
                                                        SVGInline-svg SVGInline--cleaned-svg
                                                        SVG-svg
                                                        Icon-svg Icon--check-svg Icon-color-svg
                                                        Icon-color--green500-svg
                                                    '
                                            height='12'
                                            width='12'
                                            viewBox='0 0 16 16'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                d='M5.297 13.213L.293 8.255c-.39-.394-.39-1.033 0-1.426s1.024-.394 1.414 0l4.294 4.224 8.288-8.258c.39-.393 1.024-.393 1.414 0s.39 1.033 0 1.426L6.7 13.208a.994.994 0 0 1-1.402.005z'
                                                fillRule='evenodd'
                                            ></path>
                                        </svg>
                                    </span>
                                    <span className='booking-status'> Hoàn tất </span>
                                </div>
                            )}{' '}
                            {booking.complete === false && booking.refund === false && (
                                <div
                                    style={{
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: 'rgb(227 232 238)',
                                    }}
                                >
                                    <span style={{ color: 'rgba(14, 98, 69, 1)' }}>
                                        <svg
                                            aria-hidden='true'
                                            className='
                                                        SVGInline-svg SVGInline--cleaned-svg
                                                        SVG-svg
                                                        Icon-svg Icon--clock-svg Icon-color-svg
                                                        Icon-color--gray500-svg
                                                    '
                                            height='12'
                                            width='12'
                                            viewBox='0 0 16 16'
                                            xmlns='http://www.w3.org/2000/svg'
                                            style={{ fill: 'rgb(105 115 134)' }}
                                        >
                                            <path
                                                d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-8.577V4a1 1 0 1 0-2 0v4a1 1 0 0 0 .517.876l2.581 1.49a1 1 0 0 0 1-1.732z'
                                                fillRule='evenodd'
                                            ></path>
                                        </svg>
                                    </span>
                                    <span className='booking-status'>Đang phê duyệt</span>
                                </div>
                            )}
                            {booking.refund === true && (
                                <div
                                    style={{
                                        backgroundColor: 'rgb(227 232 238)',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <span style={{ color: 'rgba(14, 98, 69, 1)' }}>
                                        <svg
                                            aria-hidden='true'
                                            className='
                                                        SVGInline-svg SVGInline--cleaned-svg
                                                        SVG-svg
                                                        Icon-svg Icon--refund-svg Icon-color-svg
                                                        Icon-color--gray500-svg
                                                    '
                                            height='12'
                                            width='12'
                                            viewBox='0 0 16 16'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                d='M10.5 5a5 5 0 0 1 0 10 1 1 0 0 1 0-2 3 3 0 0 0 0-6l-6.586-.007L6.45 9.528a1 1 0 0 1-1.414 1.414L.793 6.7a.997.997 0 0 1 0-1.414l4.243-4.243A1 1 0 0 1 6.45 2.457L3.914 4.993z'
                                                fillRule='evenodd'
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className='booking-status fs-14'
                                        style={{ color: 'rgba(14, 98, 69, 1)' }}
                                    >
                                        Đã hủy
                                    </span>
                                </div>
                            )}
                        </div>
                    </Div>
                    <div className='normal-flex user-bookings__booking-body'>
                        <Div width='80px' height='80px'>
                            <img
                                src={getImage(booking.roomThumbnail)}
                                className='w100-h100'
                                style={{ borderRadius: '8px' }}
                                alt={booking.roomThumbnail}
                            />
                        </Div>
                        <Div className='normal-flex' width='100%'>
                            <div style={{ paddingLeft: '12px', maxWidth: '65%' }} className='f1'>
                                <div className='user-bookings__room-name'>{booking.roomName}</div>
                                <div>
                                    <div style={{ color: '#717171' }} className='fs-14'>
                                        {booking.privacyType} tại
                                        {booking.roomCategory}
                                    </div>
                                </div>
                                <div>
                                    <span>Ngày đặt: </span>
                                    <span>{booking.bookingDate}</span>
                                </div>
                                <div>
                                    <span>Từ ngày: </span>
                                    <span>{booking.checkinDate}</span>
                                    <span> · </span>
                                    <span>Đến ngày: </span>
                                    <span>{booking.checkoutDate}</span>
                                </div>
                            </div>
                            <div
                                style={{ maxWidth: '35%', alignItems: 'flex-end' }}
                                className='col-flex f1'
                            >
                                <Div width='100%' className='flex'>
                                    <div className='fw-600 fs-16'>Giá thuê phòng:</div>
                                    <div className='normal-flex f1 jc-fe'>
                                        <span
                                            className='
                                                            user-bookings__currency-symbol
                                                            fw-600
                                                        '
                                        >
                                            {booking.currency}
                                        </span>
                                        <span>
                                            <span className='fw-600'>
                                                <MyNumberForMat
                                                    currency={booking.currency}
                                                    price={booking.pricePerDay}
                                                    priceFontSize='16px'
                                                    stayTypeFontSize='16px'
                                                />
                                            </span>
                                        </span>
                                    </div>
                                </Div>
                                <Div width='100%' className='flex'>
                                    <div className='fw-600 fs-16'>Phí dịch vụ:</div>
                                    <div className='normal-flex f1 jc-fe'>
                                        <span
                                            className='
                                                            user-bookings__currency-symbol
                                                            fw-600
                                                        '
                                        >
                                            {booking.currency}
                                        </span>
                                        <span className='fw-600'>
                                            <MyNumberForMat
                                                price={booking.siteFee}
                                                currency={booking.currency}
                                            />
                                        </span>
                                    </div>
                                </Div>
                                <Div width='100%' className='flex'>
                                    <div className='fw-600 fs-16'>Thời gian ở:</div>
                                    <div className='normal-flex fw-600 jc-fe f1'>
                                        {booking.numberOfDays}
                                        <span style={{ marginLeft: '5px' }}>
                                            {booking.priceType === 'PER_NIGHT' ? 'đêm' : 'tuần'}
                                        </span>
                                    </div>
                                </Div>
                            </div>
                        </Div>
                    </div>
                </div>
                <div className='col-flex user-bookings__booking-footer'>
                    <div
                        style={{ alignSelf: 'flex-end', marginBottom: '10px' }}
                        className='f1 flex'
                    >
                        <span className='fw-600 fs-16'>Tổng số tiền: </span>
                        <span className='inline-block' style={{ marginLeft: '10px' }}>
                            <span style={{ color: 'rgb(255, 56, 92)' }} className='fw-600'>
                                <MyNumberForMat
                                    price={
                                        booking.pricePerDay * booking.numberOfDays + booking.siteFee
                                    }
                                    currency={booking.currency}
                                    priceFontSize='20px'
                                    stayTypeFontSize='20px'
                                    isSuffix
                                />
                            </span>
                        </span>
                    </div>
                    <div className='normal-flex'>
                        <div className='flex jc-fe w-100'>
                            <Link to={`/room/${booking.roomId}`}>
                                <div className='mr-10'>
                                    <button className='button bg-red'>Xem phòng</button>
                                </div>
                            </Link>
                            <Link to={'/'}>
                                <div className='mr-10'>
                                    <button className='button bg-normal'>Tiếp tục đặt phòng</button>
                                </div>
                            </Link>
                            {booking.refund === false && (
                                <div className='mr-10'>
                                    <button
                                        className='button bg-normal'
                                        data-booking-id={booking.roomId}
                                        onClick={e => displayEditThumbnailBox($(e.currentTarget))}
                                    >
                                        {ratingComment !== null ? 'Xem đánh giá' : 'Đánh giá'}
                                    </button>

                                    <div
                                        className='chooseRoomThumbnail'
                                        data-booking-id={booking.roomId}
                                    >
                                        <div className='flex jc-center h-100'>
                                            <div className='innerWrapper'>
                                                <div id='boxHeader' className='normal-flex'>
                                                    <div onClick={() => hideEditThumbnailBox()}>
                                                        <Image
                                                            src={getImage('/svg/close2.svg')}
                                                            size='16px'
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                    <div className='manage-photos__title f1 flex jc-center'>
                                                        Đánh giá phòng
                                                    </div>
                                                </div>
                                                <div id='boxBody'>
                                                    <div className='col-flex'>
                                                        <div className='normal-flex'>
                                                            <div>
                                                                <Image
                                                                    src={getImage(
                                                                        booking.roomThumbnail
                                                                    )}
                                                                    size='50px'
                                                                />
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className='
                                                                                user-bookings__room-name
                                                                            '
                                                                >
                                                                    {booking.roomName}
                                                                </div>
                                                                <div>
                                                                    <div className='fs-14 717171'>
                                                                        {booking.privacyType} tại{' '}
                                                                        <span> </span>
                                                                        {booking.roomCategory}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        data-rating-cleanliness={
                                                            booking.reviewRating != null
                                                                ? booking.reviewRating.cleanliness
                                                                : 0
                                                        }
                                                        data-rating-contact={
                                                            booking.reviewRating != null
                                                                ? booking.reviewRating.contact
                                                                : 0
                                                        }
                                                        data-rating-checkin={
                                                            booking.reviewRating != null
                                                                ? booking.reviewRating.checkin
                                                                : 0
                                                        }
                                                        data-rating-accuracy={
                                                            booking.reviewRating != null
                                                                ? booking.reviewRating.accuracy
                                                                : 0
                                                        }
                                                        data-rating-location={
                                                            booking.reviewRating != null
                                                                ? booking.reviewRating.location
                                                                : 0
                                                        }
                                                        data-rating-value={
                                                            booking.reviewRating != null
                                                                ? booking.reviewRating.value
                                                                : 0
                                                        }
                                                        className='ratingContainer'
                                                    >
                                                        {ratingLabels.map((rating, index) => (
                                                            <div
                                                                className='normal-flex jc-sb'
                                                                data-rating-name={rating.label}
                                                                key={rating.label}
                                                            >
                                                                <label>{rating.label}</label>
                                                                <div
                                                                    className='
                                                                                normal-flex
                                                                                ratingStarContainer
                                                                            '
                                                                    data-label={rating.label}
                                                                >
                                                                    {rating.stars.map(
                                                                        (star, idx) => (
                                                                            <div>
                                                                                <svg
                                                                                    enableBackground='new 0 0 15 15'
                                                                                    viewBox='0 0 15 15'
                                                                                    x='0'
                                                                                    y='0'
                                                                                    data-star-value={
                                                                                        idx + 1
                                                                                    }
                                                                                    className='
                                                                                            ratingStar
                                                                                        '
                                                                                    key={
                                                                                        star +
                                                                                        idx +
                                                                                        1
                                                                                    }
                                                                                >
                                                                                    <polygon
                                                                                        points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                                                                                        strokeLinecap='round'
                                                                                        strokeLinejoin='round'
                                                                                        strokeMiterlimit='10'
                                                                                    ></polygon>
                                                                                </svg>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <label className='form-label'>
                                                                Bình luận:
                                                            </label>
                                                            <input
                                                                type='text'
                                                                id='ratingComment'
                                                                name='ratingComment'
                                                                value={ratingComment}
                                                                onChange={e =>
                                                                    setRatingComment(e.target.value)
                                                                }
                                                                disabled={
                                                                    ratingComment !== null
                                                                        ? true
                                                                        : false
                                                                }
                                                                placeholder='Để lại bình luận ở đây!'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id='boxFooter' className='flex-space'>
                                                    <div>
                                                        <button
                                                            className='
                                                                        manage-photos__cancel-btn
                                                                    '
                                                            onClick={() => hideEditThumbnailBox()}
                                                        >
                                                            Hủy
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className='
                                                                        manage-photos__save-edit-btn
                                                                    '
                                                            data-booking-id={booking.bookingId}
                                                            onClick={e =>
                                                                reviewSubmit($(e.currentTarget))
                                                            }
                                                            style={{
                                                                display:
                                                                    ratingComment !== null
                                                                        ? 'none'
                                                                        : 'block',
                                                            }}
                                                        >
                                                            Đánh giá
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <input
                                type='hidden'
                                name=''
                                value={booking.bookingDate}
                                className='bookingDate'
                                data-is-cancel={booking.refund}
                                data-is-complete={booking.complete}
                            />

                            {booking.refund === false && booking.complete === false && (
                                <div className='cancelBookingBtn mr-10'>
                                    <Link to={`/booking/${booking.bookingId}/cancel`}>
                                        <button className='button bg-normal'>Hủy đặt phòng</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Toast />
        </>
    );
};

export default BookedRoom;
