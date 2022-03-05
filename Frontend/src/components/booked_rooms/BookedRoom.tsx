import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import { IBookedRoom, IRatingLabel } from '../../type/user/type_User';
import { MyNumberForMat } from '../utils';

interface IBookedRoomProps {
    booking: IBookedRoom;
    ratingLabels: IRatingLabel[];
}

const BookedRoom: FC<IBookedRoomProps> = ({ booking, ratingLabels }) => {
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
                                        style={{
                                            display: 'block',
                                            fill: 'none',
                                            height: '16px',
                                            width: '16px',
                                            stroke: 'currentcolor',
                                            strokeWidth: 2,
                                            overflow: 'visible',
                                        }}
                                        viewBox='0 0 32 32'
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
                                        className='w100-h100 rounded-border'
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
                                                fill-rule='evenodd'
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
                                                fill-rule='evenodd'
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
                                                fill-rule='evenodd'
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
                                className='img'
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
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div className='fw-600 fs-16'>Giá thuê phòng:</div>
                                    <div
                                        style={{ justifyContent: 'flex-end' }}
                                        className='normal-flex f1'
                                    >
                                        <span
                                            className='
                                                            user-bookings__currency-symbol
                                                            fw-600
                                                        '
                                        >
                                            {booking.currency}
                                        </span>
                                        <span>
                                            <span className='fw-600 fs-16'>
                                                <MyNumberForMat
                                                    currency={booking.currency}
                                                    price={booking.pricePerDay}
                                                />
                                            </span>
                                        </span>
                                    </div>
                                </div>
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
                                            {booking.priceType === 'PER_NIGTH' ? 'dêm' : 'tuần'}
                                        </span>
                                    </div>
                                </Div>
                            </div>
                        </Div>
                    </div>
                </div>
                <div className='col-flex user-bookings__booking-footer'>
                    <div style={{ alignSelf: 'flex-end', marginBottom: '10px' }} className='f1'>
                        <span className='fw-600 fs-16'>Tổng số tiền: </span>
                        <span>
                            <span
                                style={{ fontSize: '20px', color: 'rgb(255, 56, 92)' }}
                                className='fw-600'
                            >
                                <MyNumberForMat
                                    price={
                                        booking.pricePerDay * booking.numberOfDays + booking.siteFee
                                    }
                                    currency={booking.currency}
                                    // stayType={booking.priceType}
                                />
                            </span>
                        </span>
                    </div>
                    <div className='normal-flex'>
                        <div className='flex flex jc-fe w100'>
                            <Link to={`/room/${booking.roomId}`}>
                                <div style={{ marginRight: '10px' }}>
                                    <button className='button bg-red'>Xem phòng</button>
                                </div>
                            </Link>
                            <Link to={'/'}>
                                <div style={{ marginRight: '10px' }}>
                                    <button className='button bg-normal'>Tiếp tục đặt phòng</button>
                                </div>
                            </Link>
                            {booking.refund === false && (
                                <div style={{ marginRight: '10px' }}>
                                    <button
                                        className='button bg-normal'
                                        data-booking-id={booking.roomId}
                                        // onclick='displayEditThumbnailBox($(this));'
                                        // th:if='${removeReview != true}'
                                    >
                                        Đánh giá
                                    </button>

                                    <div
                                        className='chooseRoomThumbnail'
                                        data-booking-id={booking.roomId}
                                    >
                                        <div className='flex jc-center'>
                                            <div className='innerWrapper'>
                                                <div id='boxHeader' className='normal-flex'>
                                                    {/*onClick='hideEditThumbnailBox();'*/}
                                                    <div>
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
                                                                        {booking.roomCategory}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(2,1fr)',
                                                            padding: '29px 0',
                                                            columnGap: '10px',
                                                        }}
                                                        data-rating-cleanliness='${booking.review != null ? booking.review.subRating.cleanliness : 0}'
                                                        data-rating-contact='${booking.review != null ? booking.review.subRating.contact : 0}'
                                                        data-rating-checkin='${booking.review != null ? booking.review.subRating.checkin : 0}'
                                                        data-rating-accuracy='${booking.review != null ? booking.review.subRating.accuracy : 0}'
                                                        data-rating-location='${booking.review != null ? booking.review.subRating.location : 0}'
                                                        data-rating-value='${booking.review != null ? booking.review.subRating.value : 0}'
                                                        className='ratingContainer'
                                                    >
                                                        {ratingLabels.map((rating, index) => (
                                                            <div
                                                                className='normal-flex'
                                                                style={{
                                                                    justifyContent: 'space-between',
                                                                }}
                                                                data-rating-name={rating.label}
                                                            >
                                                                <label style={{ margin: 0 }}>
                                                                    {rating.label}
                                                                </label>
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
                                                                                    width='32px'
                                                                                    height='32px'
                                                                                    style={{
                                                                                        display:
                                                                                            'block',
                                                                                        marginRight:
                                                                                            '5px',
                                                                                        cursor: 'pointer',
                                                                                    }}
                                                                                    data-star-value={
                                                                                        idx + 1
                                                                                    }
                                                                                    className='
                                                                                            ratingStar
                                                                                        '
                                                                                >
                                                                                    <polygon
                                                                                        points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                                                                                        stroke-linecap='round'
                                                                                        stroke-linejoin='round'
                                                                                        stroke-miterlimit='10'
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
                                                                style={{ height: '69px' }}
                                                                name='ratingComment'
                                                                value={
                                                                    booking.bookingReview !== null
                                                                        ? booking.bookingReview
                                                                        : ''
                                                                }
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
                                                            // onclick='hideEditThumbnailBox();'
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
                                                            // onclick='reviewSubmit($(this));'
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

                            <div className='cancelBookingBtn mr-10'>
                                <Link to={`/booking/${booking.bookingId}/cancel`}>
                                    <button className='button bg-normal'>Hủy đặt phòng</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookedRoom;
