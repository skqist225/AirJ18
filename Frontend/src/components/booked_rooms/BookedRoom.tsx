import { FC } from 'react';

interface IBookedRoomProps {}

const BookedRoom: FC<IBookedRoomProps> = () => {
    return (
        <>
            <div class='user-bookings__booking-box'>
                <div class='box-padding'>
                    <div class='flex-space' style='padding-bottom: 10px'>
                        <div class='normal-flex'>
                            <div>
                                <button
                                    class='user-bookings__add-to-fav-btn room__likeBtn'
                                    th:data-room-id='${booking.room.id}'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        aria-hidden='true'
                                        focusable='false'
                                        role='presentation'
                                        style='
                                                        display: block;
                                                        fill: none;
                                                        height: 16px;
                                                        width: 16px;
                                                        stroke: currentcolor;
                                                        stroke-width: 2;
                                                        overflow: visible;
                                                    '
                                        viewBox='0 0 32 32'
                                        class='heartSvg'
                                    >
                                        <path d='m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z'></path>
                                    </svg>
                                    <span style='display: inline-block; margin-left: 5px'>
                                        Yêu thích
                                    </span>
                                </button>
                            </div>
                            <div class='normal-flex' style='margin-left: 10px'>
                                <div style='width: 40px; height: 40px'>
                                    <img
                                        th:src='@{${booking.customer.avatarPath}}'
                                        alt=''
                                        class='img rounded-border'
                                    />
                                </div>
                                <div class='user-bookings__customer-name'>
                                    [[${booking.customer.fullName}]]
                                </div>
                            </div>
                        </div>
                        <div>
                            <div
                                style='
                                                padding: 1px 6px;
                                                border-radius: 4px;
                                                background-color: rgb(203 244 201);
                                            '
                                th:if='${booking.isComplete == true} and ${booking.isRefund == false}'
                            >
                                <span style='color: rgba(14, 98, 69, 1)'>
                                    <svg
                                        aria-hidden='true'
                                        class='
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
                                <span class='booking-status'> Hoàn tất </span>
                            </div>
                            <div
                                style='
                                                padding: 1px 6px;
                                                border-radius: 4px;
                                                background-color: rgb(227 232 238);
                                            '
                                th:if='${booking.isComplete == false} and ${booking.isRefund == false}'
                            >
                                <span style='color: rgba(14, 98, 69, 1)'>
                                    <svg
                                        aria-hidden='true'
                                        class='
                                                        SVGInline-svg SVGInline--cleaned-svg
                                                        SVG-svg
                                                        Icon-svg Icon--clock-svg Icon-color-svg
                                                        Icon-color--gray500-svg
                                                    '
                                        height='12'
                                        width='12'
                                        viewBox='0 0 16 16'
                                        xmlns='http://www.w3.org/2000/svg'
                                        style='fill: rgb(105 115 134)'
                                    >
                                        <path
                                            d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-8.577V4a1 1 0 1 0-2 0v4a1 1 0 0 0 .517.876l2.581 1.49a1 1 0 0 0 1-1.732z'
                                            fill-rule='evenodd'
                                        ></path>
                                    </svg>
                                </span>
                                <span class='booking-status'>Đang phê duyệt</span>
                            </div>
                            <div
                                th:if='${booking.isRefund == true}'
                                style='
                                                background-color: rgb(227 232 238);
                                                padding: 1px 6px;
                                                border-radius: 4px;
                                            '
                            >
                                <span style='color: rgba(14, 98, 69, 1)'>
                                    <svg
                                        aria-hidden='true'
                                        class='
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
                                    class='booking-status'
                                    style='color: rgba(14, 98, 69, 1); font-size: 14px'
                                >
                                    Đã hủy
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class='normal-flex user-bookings__booking-body'>
                        <div style='width: 80px; height: 80px'>
                            <img
                                th:src='@{${booking.room.renderThumbnailImage}}'
                                class='img'
                                style='border-radius: 8px'
                            />
                        </div>
                        <div class='normal-flex' style='width: 100%'>
                            <div style='padding-left: 12px; flex: 1; max-width: 65%'>
                                <div class='user-bookings__room-name'>[[${booking.room.name}]]</div>
                                <div>
                                    <div style='font-size: 14px; color: #717171'>
                                        [[${booking.room.privacyType.name}]] tại [[$
                                        {booking.room.category.name}]]
                                    </div>
                                </div>
                                <div>
                                    <span>Ngày đặt: </span>
                                    <span th:text="${#temporals.format(booking.bookingDate, 'dd-MM-yyyy')}"></span>
                                </div>
                                <div>
                                    <span>Từ ngày: </span>
                                    <span th:text="${#dates.format(booking.checkinDate, 'dd-MM-yyyy')}"></span>
                                    <span> · </span>
                                    <span>Đến ngày: </span>
                                    <span th:text="${#dates.format(booking.checkoutDate, 'dd-MM-yyyy')}"></span>
                                </div>
                            </div>
                            <div
                                style='flex: 1; max-width: 35%; align-items: flex-end'
                                class='col-flex'
                            >
                                <div style='display: flex; width: 100%'>
                                    <div class='fw-600 fs-16'>Giá thuê phòng:</div>
                                    <div
                                        style='flex: 1; justify-content: flex-end'
                                        class='normal-flex'
                                    >
                                        <span
                                            class='
                                                            user-bookings__currency-symbol
                                                            fw-600
                                                        '
                                        >
                                            [[${booking.room.currency.symbol}]]
                                        </span>
                                        <span>
                                            <span class='fw-600 fs-16'>
                                                [[$
                                                {#numbers.formatDecimal(
                                                    booking.pricePerDay,
                                                    3,
                                                    'POINT',
                                                    0,
                                                    'COMMA'
                                                )}
                                                ]]
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div style='display: flex; width: 100%'>
                                    <div class='fw-600 fs-16'>Phí dịch vụ:</div>
                                    <div
                                        style='flex: 1; justify-content: flex-end'
                                        class='normal-flex'
                                    >
                                        <span
                                            class='
                                                            user-bookings__currency-symbol
                                                            fw-600
                                                        '
                                        >
                                            [[${booking.room.currency.symbol}]]
                                        </span>
                                        <span class='fw-600'>
                                            [[$
                                            {#numbers.formatDecimal(
                                                booking.siteFee,
                                                3,
                                                'POINT',
                                                0,
                                                'COMMA'
                                            )}
                                            ]]
                                        </span>
                                    </div>
                                </div>
                                <div style='display: flex; width: 100%'>
                                    <div class='fw-600 fs-16'>Thời gian ở:</div>
                                    <div
                                        style='flex: 1; justify-content: flex-end'
                                        class='normal-flex fw-600'
                                    >
                                        [[${booking.numberOfDays}]]
                                        <span
                                            th:if='${booking.room.priceType.equals(T(com.airtnt.entity.PriceType).PER_NIGHT)}'
                                            style='margin-left: 5px'
                                        >
                                            đêm{' '}
                                        </span>
                                        <span
                                            th:if='${booking.room.priceType.equals(T(com.airtnt.entity.PriceType).PER_WEEK)}'
                                            style='margin-left: 5px'
                                        >
                                            tuần
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='col-flex user-bookings__booking-footer'>
                    <div style='flex: 1; align-self: flex-end; margin-bottom: 10px'>
                        <span class='fw-600 fs-16'>Tổng số tiền: </span>
                        <span>
                            <span style='font-size: 20px; color: rgb(255, 56, 92)' class='fw-600'>
                                [[$
                                {#numbers.formatDecimal(booking.totalFee, 3, 'POINT', 0, 'COMMA')}
                                ]][[${booking.room.currency.symbol}]]
                            </span>
                        </span>
                    </div>
                    <div class='normal-flex'>
                        <div
                            style='
                                            display: flex;
                                            justify-content: flex-end;
                                            width: 100%;
                                        '
                        >
                            <a
                                th:href="@{${'/room/' + booking.room.id}}
                                    "
                                style='text-decoration: none'
                            >
                                <div style='margin-right: 10px'>
                                    <button class='button bg-red'>Xem phòng</button>
                                </div>
                            </a>
                            <a th:href='@{/}' style='text-decoration: none'>
                                <div style='margin-right: 10px'>
                                    <button class='button bg-normal'>Tiếp tục đặt phòng</button>
                                </div>
                            </a>
                            <div style='margin-right: 10px' th:if='${booking.isRefund == false}'>
                                <button
                                    class='button bg-normal'
                                    th:data-booking-id='${booking.id}'
                                    onclick='displayEditThumbnailBox($(this));'
                                    th:if='${removeReview != true}'
                                >
                                    Đánh giá
                                </button>

                                <div class='chooseRoomThumbnail' th:data-booking-id='${booking.id}'>
                                    <div style='display: flex; justify-content: center'>
                                        <div class='innerWrapper'>
                                            <div id='boxHeader' class='normal-flex'>
                                                <div onclick='hideEditThumbnailBox();'>
                                                    <img
                                                        th:src='@{/svg/close2.svg}'
                                                        alt=''
                                                        width='16px'
                                                        height='16px'
                                                        style='cursor: pointer'
                                                    />
                                                </div>
                                                <div
                                                    style='
                                                                    flex: 1;
                                                                    display: flex;
                                                                    justify-content: center;
                                                                '
                                                    class='manage-photos__title'
                                                >
                                                    Đánh giá phòng
                                                </div>
                                            </div>
                                            <div id='boxBody'>
                                                <div
                                                    style='
                                                                    display: flex;
                                                                    flex-direction: column;
                                                                '
                                                >
                                                    <div class='normal-flex'>
                                                        <div>
                                                            <img
                                                                th:src='@{${booking.room.renderThumbnailImage}}'
                                                                alt=''
                                                                width='50px'
                                                                height='50px'
                                                            />
                                                        </div>
                                                        <div>
                                                            <div
                                                                class='
                                                                                user-bookings__room-name
                                                                            '
                                                            >
                                                                [[$
                                                                {booking.room.name}
                                                                ]]
                                                            </div>
                                                            <div>
                                                                <div
                                                                    style='
                                                                                    font-size: 14px;
                                                                                    color: #717171;
                                                                                '
                                                                >
                                                                    [[$
                                                                    {booking.room.privacyType.name}
                                                                    ]] tại [[$
                                                                    {booking.room.category.name}
                                                                    ]]
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    style='
                                                                    display: grid;
                                                                    grid-template-columns: repeat(
                                                                        2,
                                                                        1fr
                                                                    );
                                                                    padding: 29px 0;
                                                                    column-gap: 10px;
                                                                '
                                                    th:data-rating-cleanliness='${booking.review != null ? booking.review.subRating.cleanliness : 0}'
                                                    th:data-rating-contact='${booking.review != null ? booking.review.subRating.contact : 0}'
                                                    th:data-rating-checkin='${booking.review != null ? booking.review.subRating.checkin : 0}'
                                                    th:data-rating-accuracy='${booking.review != null ? booking.review.subRating.accuracy : 0}'
                                                    th:data-rating-location='${booking.review != null ? booking.review.subRating.location : 0}'
                                                    th:data-rating-value='${booking.review != null ? booking.review.subRating.value : 0}'
                                                    class='ratingContainer'
                                                >
                                                    <th:block th:each='rating, itr1 : ${ratings}'>
                                                        <div
                                                            class='normal-flex'
                                                            style='
                                                                            justify-content: space-between;
                                                                        '
                                                            th:data-rating-name='${rating.label}'
                                                        >
                                                            <label for='' style='margin: 0'>
                                                                [[${rating.label}]]
                                                            </label>
                                                            <div
                                                                class='
                                                                                normal-flex
                                                                                ratingStarContainer
                                                                            '
                                                                th:data-label='${rating.label}'
                                                            >
                                                                <th:block th:each='star, itr2 : ${rating.stars}'>
                                                                    <div>
                                                                        <svg
                                                                            enableBackground='new 0 0 15 15'
                                                                            viewBox='0 0 15 15'
                                                                            x='0'
                                                                            y='0'
                                                                            width='32px'
                                                                            height='32px'
                                                                            style='
                                                                                            display: block;
                                                                                            margin-right: 5px;
                                                                                            cursor: pointer;
                                                                                        '
                                                                            th:data-star-value='${itr2.index + 1}'
                                                                            class='
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
                                                                </th:block>
                                                            </div>
                                                        </div>
                                                    </th:block>
                                                </div>
                                                <div>
                                                    <div>
                                                        <label for='' class='form-label'>
                                                            Bình luận:
                                                        </label>
                                                        <input
                                                            type='text'
                                                            id='ratingComment'
                                                            style='height: 69px'
                                                            name='ratingComment'
                                                            th:value="${booking.review != null ? booking.review.comment : ''}"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div id='boxFooter' class='flex-space'>
                                                <div>
                                                    <button
                                                        class='
                                                                        manage-photos__cancel-btn
                                                                    '
                                                        onclick='hideEditThumbnailBox();'
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                                <div>
                                                    <button
                                                        class='
                                                                        manage-photos__save-edit-btn
                                                                    '
                                                        th:data-booking-id='${booking.id}'
                                                        onclick='reviewSubmit($(this));'
                                                    >
                                                        Đánh giá
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input
                                type='hidden'
                                name=''
                                th:value='${booking.bookingDate}'
                                class='bookingDate'
                                th:data-is-cancel='${booking.isRefund}'
                                th:data-is-complete='${booking.isComplete}'
                            />

                            <div style='margin-right: 10px' class='cancelBookingBtn'>
                                <a
                                    th:href="@{${'/booking/' + booking.id + '/cancel'}}"
                                    style='text-decoration: none'
                                >
                                    <button class='button bg-normal'>Hủy đặt phòng</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookedRoom;
