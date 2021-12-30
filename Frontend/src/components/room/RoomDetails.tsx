import React, { FC, ReactElement, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomById } from '../../features/room/roomSlice';
import { RootState } from '../../store';
import { IRoomDetails } from '../../type/type_RoomDetails';
import Header from '../Header';

interface IRoomDetailsProps {
    roomId: number;
}

const RoomDetails: FC<IRoomDetailsProps> = ({ roomId }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchRoomById({ roomId }));
    }, [dispatch]);

    const { room, loading }: { room: IRoomDetails; loading: boolean } = useSelector(
        (state: RootState) => state.room
    );

    return (
        <>
            <Header excludeBecomeHostAndNavigationHeader={true} includeMiddle={false} />
            <main>
                <div className='rdt_header' style={{ position: 'relative' }}>
                    <h1 className='rdt_name'>{room?.name}</h1>
                    <input type='hidden' id='roomId' value='${room.id}' />
                    <div className='rdt_below__header flex'>
                        <div className='rdt_location__info text'>
                            <span>{room?.location}</span>
                        </div>
                        <div className='rdt_header__action'>
                            <button
                                className='room__likeBtn rdt_button__action'
                                data-room-id={room?.id}
                            >
                                <svg
                                    viewBox='0 0 32 32'
                                    xmlns='http://www.w3.org/2000/svg'
                                    aria-hidden='true'
                                    role='presentation'
                                    focusable='false'
                                    style={{
                                        display: 'block',
                                        fill: 'rgba(0, 0, 0, 0.5)',
                                        height: '24px',
                                        width: '24px',
                                        stroke: 'rgb(255, 255, 255)',
                                        strokeWidth: '2',
                                        overflow: 'visible',
                                    }}
                                    className='heartSvg'
                                >
                                    <path d='m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z'></path>
                                </svg>
                                <span>Lưu</span>
                            </button>
                        </div>
                    </div>

                    <section className='rdt_images grid'>
                        <div style={{ height: '480px' }}>
                            <img
                                src={`${process.env.SERVER_URL}${room?.thumbnail}`}
                                width='100%'
                                height='100%'
                                className='image'
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div className='rdt_images__left' style={{ height: '470px' }}>
                                {room?.images.map((image: string, index: number) => {
                                    return (
                                        <div style={{ width: '100%', height: 'calc(470px / 2)' }}>
                                            <img
                                                src='@{${image.getImagePath(room.host.email, room.id)}}'
                                                style={{ width: '100%', height: '100%' }}
                                                className={
                                                    index % 2 === 0
                                                        ? 'roundedBorder image'
                                                        : 'image'
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <a href="@{${room.id + '/images'}}">
                                <div className='rdt_showMoreImage'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 17 17'
                                        role='presentation'
                                        aria-hidden='true'
                                        focusable='false'
                                        style={{
                                            height: '12px',
                                            width: '12px',
                                            display: 'block',
                                        }}
                                    >
                                        <circle cx='1.5' cy='1.5' r='1.5'></circle>
                                        <circle cx='1.5' cy='8.5' r='1.5'></circle>
                                        <circle cx='8.5' cy='1.5' r='1.5'></circle>
                                        <circle cx='8.5' cy='8.5' r='1.5'></circle>
                                        <circle cx='15.5' cy='1.5' r='1.5'></circle>
                                        <circle cx='15.5' cy='8.5' r='1.5'></circle>
                                        <circle cx='1.5' cy='15.5' r='1.5'></circle>
                                        <circle cx='8.5' cy='15.5' r='1.5'></circle>
                                        <circle cx='15.5' cy='15.5' r='1.5'></circle>
                                    </svg>
                                    <div style={{ paddingLeft: '12px' }}>Hiển thị tất cả ảnh</div>
                                </div>
                            </a>
                        </div>
                    </section>

                    <main className='rdt_body'>
                        <div className='grid__2_1'>
                            <article>
                                <div className='rdt_room__count flex'>
                                    <div>
                                        <h2 style='font-size: 22px; line-height: 40px'>
                                            Phòng riêng tại room.category.name. Chủ nhà
                                            room.host.firstName room.host.lastName
                                        </h2>
                                        <p style='font-size: 16px; font-weight: 500'>
                                            room.accomodatesCount khách · room.bathroomCount phòng
                                            ngủ · room.bedCount giường · room.bedroomCount phòng tắm
                                            riêng
                                        </p>
                                    </div>
                                    <div>
                                        <img
                                            src='@{${room.host.avatarPath}}'
                                            alt=''
                                            className='image'
                                            width='64px'
                                            height='64px'
                                            style='border-radius: 50%'
                                        />
                                    </div>
                                </div>
                                <div className='rdt_description rdt_body__common'>
                                    <p>room.description</p>
                                </div>
                                <div className='rdt_bedroom_info rdt_body__common'>
                                    <div className='rdt_amentity__header'>Nơi bạn sẽ ngủ nghỉ</div>
                                    <div className='rdt_room__decor'>
                                        <div
                                            style='
                                            display: flex;
                                            align-items: center;
                                            margin-bottom: 16px;
                                        '
                                        >
                                            <block each='bed : ${numberOfBed}'>
                                                <span>
                                                    <svg
                                                        viewBox='0 0 32 32'
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        aria-hidden='true'
                                                        role='presentation'
                                                        focusable='false'
                                                        style='
                                                        display: block;
                                                        height: 24px;
                                                        wid 24px;
                                                        fill: currentcolor;
                                                    '
                                                    >
                                                        <path d='M24 4a2 2 0 0 1 1.995 1.85L26 6v7.839l1.846 5.537a3 3 0 0 1 .115.468l.03.24.009.24V30h-2v-2H6v2H4v-9.675a3 3 0 0 1 .087-.717l.067-.232L6 13.836V6a2 2 0 0 1 1.697-1.977l.154-.018L8 4zm2 18H6v4h20zm-1.388-6H7.387l-1.333 4h19.891zM24 6H8v8h3v-4a2 2 0 0 1 1.85-1.995L13 8h6a2 2 0 0 1 1.995 1.85L21 10v4h3zm-5 4h-6v4h6z'></path>
                                                    </svg>{' '}
                                                </span>
                                            </block>
                                        </div>
                                        <div style='margin-bottom: 8px; font-size: 16px'>
                                            Phòng ngủ
                                        </div>
                                        <div style='font-size: 14px'>
                                            <span text='${#arrays.length(numberOfBed)}'></span>
                                            giường đơn
                                        </div>
                                    </div>
                                </div>
                                <div className='rdt_amentity rdt_body__common'>
                                    <h4 className='rdt_amentity__header'>
                                        Nơi này có những gì cho bạn
                                    </h4>
                                    <div style='display: grid; grid-template-columns: repeat(2, 1fr)'>
                                        <block each='amt : ${room.amentities}'>
                                            <div
                                                style='
                                                display: flex;
                                                align-items: center;
                                                padding-bottom: 16px;
                                                height: 40px;
                                            '
                                            >
                                                <span remove='tag'>
                                                    <img
                                                        src='@{${amt.iconImagePath}}'
                                                        alt=''
                                                        width='36px'
                                                        height='36px'
                                                    />
                                                </span>
                                                <span style='padding-left: 16px'>amt.name</span>
                                            </div>
                                        </block>
                                    </div>
                                </div>
                                <div id='rdt_calender'>
                                    <div>
                                        <div
                                            style='
                                            font-size: 20px;
                                            font-weight: 500;
                                            margin-bottom: 5px;
                                        '
                                        >
                                            Chọn ngày nhận phòng
                                        </div>
                                        <div
                                            style='
                                            display: none;
                                            font-size: 20px;
                                            font-weight: 500;
                                            margin-bottom: 5px;
                                        '
                                            id='numberOfDaysContainer'
                                        >
                                            <span id='daysAtHere'>1</span> đêm tại room.city.name
                                        </div>
                                    </div>
                                    <div style='color: #717171'>
                                        <div id='beforeEndDateContainer'>
                                            <span id='beforeChooseDay' style='font-size: 14px'>
                                                Thêm ngày đi để biết giá chính xác
                                            </span>
                                        </div>
                                        <div style='display: none' id='fromDayToDayContainer'>
                                            <span id='fromDay'>Từ ngày</span> -
                                            <span id='toDay'>đến ngày</span>
                                        </div>
                                    </div>
                                    <div className='rdt_calender__header'>
                                        <div className='flex3'>
                                            <div className='firstMonth'>
                                                <div style='display: flex; align-items: center'>
                                                    <div replace="room/_room_details_partial :: nextCoupleOfMonth('close3', 'getThePrevTwoMonth')"></div>
                                                    <div className='monthTitle firstMonthAndYear'>
                                                        Tháng MM năm YYY
                                                    </div>
                                                </div>
                                                <div className='rdt_calender__body'>
                                                    <div
                                                        className='flex3'
                                                        style='wid calc(44px * 7)'
                                                    >
                                                        <div className='date'>CN</div>
                                                        <div className='date'>T2</div>
                                                        <div className='date'>T3</div>
                                                        <div className='date'>T4</div>
                                                        <div className='date'>T5</div>
                                                        <div className='date'>T6</div>
                                                        <div className='date'>T7</div>
                                                    </div>
                                                    <table className='rdt_calender__days'></table>
                                                </div>
                                            </div>
                                            <div className='secondMonth'>
                                                <div style='display: flex; align-items: center'>
                                                    <div className='pseudoContainer'>
                                                        <div className='secondMonthAndYear monthTitle'>
                                                            Tháng MM + 1 năm YYYY
                                                        </div>
                                                    </div>
                                                    <div replace="room/_room_details_partial :: nextCoupleOfMonth('nextMonth', 'getTheNextTwoMonth')"></div>
                                                </div>
                                                <div className='rdt_calender__body'>
                                                    <div
                                                        className='flex3'
                                                        style='wid calc(44px * 7)'
                                                    >
                                                        <div className='date'>CN</div>
                                                        <div className='date'>T2</div>
                                                        <div className='date'>T3</div>
                                                        <div className='date'>T4</div>
                                                        <div className='date'>T5</div>
                                                        <div className='date'>T6</div>
                                                        <div className='date'>T7</div>
                                                    </div>
                                                    <table className='rdt_calender__days_plus-1'></table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <article className='rdt_booking'>
                                <div
                                    style='
                                    border: 1px solid rgb(221, 221, 221);
                                    border-radius: 12px;
                                    padding: 24px;
                                    box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
                                    wid 373px;
                                    float: right;
                                '
                                >
                                    <div style='margin-bottom: 24px'>
                                        <span className='rdt__price'>
                                            room.currency.symbol#numbers.formatDecimal(room.price,3,
                                            'POINT',0, 'COMMA')
                                        </span>
                                        <span
                                            style='font-size: 16px'
                                            if='${room.priceType.equals(T(com.airtnt.entity.PriceType).PER_NIGHT)}'
                                        >
                                            / đêm
                                        </span>
                                        <span
                                            style='font-size: 16px'
                                            if='${room.priceType.equals(T(com.airtnt.entity.PriceType).PER_WEEK)}'
                                        >
                                            / tuần
                                        </span>
                                    </div>
                                    <div
                                        style='
                                        border: 1px solid #b0b0b0;
                                        border-radius: 10px;
                                        font-size: 14px;
                                        overflow: hidden;
                                        margin-bottom: 20px;
                                    '
                                    >
                                        <div className='flex'>
                                            <div style='padding: 10px 12px 10px; wid 50%'>
                                                <div style='font-weight: 600'>Nhận phòng</div>
                                                <div id='checkinDate'>Thêm ngày</div>
                                            </div>
                                            <div
                                                style='
                                                padding: 10px 12px 10px;
                                                wid 50%;
                                                border-left: 0.5px solid rgb(211, 211, 211);
                                            '
                                            >
                                                <div style='font-weight: 600'>Trả phòng</div>
                                                <div id='checkoutDate'>Thêm ngày</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type='submit'
                                            className='rdt_booking_button'
                                            onclick='processBooking();'
                                        >
                                            <span>
                                                <span
                                                    style='
                                                    background-position: calc(
                                                            (100 - var(--mouse-x, 0)) * 1%
                                                        )
                                                        calc((100 - var(--mouse-y, 0)) * 1%);
                                                    --mouse-x: 96.4371;
                                                    --mouse-y: 50;
                                                '
                                                ></span>
                                            </span>
                                            <span>Đặt phòng</span>
                                        </button>
                                    </div>
                                    <div className='previewPrice-line' style='margin-top: 20px'>
                                        <div className='flex-space'>
                                            <div>
                                                <button className='rdt_transparent__btn'>
                                                    <div style='color: rgb(32, 32, 32); font-size: 14px'>
                                                        room.currency.symbol#numbers.formatDecimal(room.price,3,
                                                        'POINT',0, 'COMMA') x
                                                        <span id='numberOfNight'>7</span>
                                                        &nbsp;đêm&nbsp;
                                                    </div>
                                                </button>
                                            </div>
                                            <div style='font-size: 14px'>
                                                room.currency.symbol<span id='totalPrice'></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='previewPrice-line'>
                                        <div className='flex-space'>
                                            <div>
                                                <button className='rdt_transparent__btn'>
                                                    <div
                                                        style='
                                                        color: rgb(32, 32, 32);
                                                        font-size: 14px;
                                                        text-decoration: underline;
                                                    '
                                                    >
                                                        Phí dịch vụ
                                                    </div>
                                                </button>
                                            </div>
                                            <div style='font-size: 14px'>
                                                room.currency.symbol<span id='siteFee'></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex' style='padding-top: 16px'>
                                        <div className='totalPriceTitle'>Tổng</div>
                                        <div className='totalPriceTitle'>
                                            room.currency.symbol<span id='finalTotalPrice'></span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                        <div id='rdt__review'>
                            <div>
                                <div className='normal-flex'>
                                    <img src='@{/svg/star.svg}' width='16px' height='16px' />
                                    <span
                                        style='
                                        font-weight: 600;
                                        font-size: 22px;
                                        display: inline-block;
                                        margin-left: 12px;
                                    '
                                    >
                                        <span
                                            text="${#numbers.formatDecimal(avgRatings, 0, 'POINT', 2,
                                    'COMMA')}"
                                            if='${numberOfReviews > 0}'
                                        ></span>
                                        <span if='${numberOfReviews == 0}'>0</span>· numberOfReviews
                                        đánh giá
                                    </span>
                                </div>
                                <div className='normal-flex' style='margin-bottom: 42px'>
                                    <div style='flex: 1; max-wid 50%'>
                                        <div className='rdt__review-line'>
                                            <div>Mức độ sạch sẽ</div>
                                            <div className='normal-flex'>
                                                <div className='rdt__empty-rating'>
                                                    <div
                                                        id='cleanlinessRating'
                                                        className='rdt__rating'
                                                    ></div>
                                                </div>
                                                <span id='averageCleanlinessRating'></span>
                                            </div>
                                        </div>
                                        <div className='rdt__review-line'>
                                            <div>Liên lạc</div>
                                            <div className='normal-flex'>
                                                <div className='rdt__empty-rating'>
                                                    <div
                                                        id='contactRating'
                                                        className='rdt__rating'
                                                    ></div>
                                                </div>
                                                <span id='averageContactRating'></span>
                                            </div>
                                        </div>
                                        <div className='rdt__review-line'>
                                            <div>Nhận phòng</div>
                                            <div className='normal-flex'>
                                                <div className='rdt__empty-rating'>
                                                    <div
                                                        id='checkinRating'
                                                        className='rdt__rating'
                                                    ></div>
                                                </div>
                                                <span id='averageCheckinRating'></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='avgRatingWrapper'>
                                        <div className='rdt__review-line'>
                                            <div>Độ chính xác</div>
                                            <div className='normal-flex'>
                                                <div className='rdt__empty-rating'>
                                                    <div
                                                        id='accuracyRating'
                                                        className='rdt__rating'
                                                    ></div>
                                                </div>
                                                <span id='averageAccuracyRating'></span>
                                            </div>
                                        </div>
                                        <div className='rdt__review-line'>
                                            <div>Vị trí</div>
                                            <div className='normal-flex'>
                                                <div className='rdt__empty-rating'>
                                                    <div
                                                        id='locationRating'
                                                        className='rdt__rating'
                                                    ></div>
                                                </div>
                                                <span id='averageLocationRating'></span>
                                            </div>
                                        </div>
                                        <div className='rdt__review-line'>
                                            <div>Giá trị</div>
                                            <div className='normal-flex'>
                                                <div className='rdt__empty-rating'>
                                                    <div
                                                        id='valueRating'
                                                        className='rdt__rating'
                                                    ></div>
                                                </div>
                                                <span id='averageValueRating'></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style='display: grid; grid-template-columns: repeat(2, 1fr)'>
                                    {room?.reviews.map(review => (
                                        <div className='rdt__review-box'>
                                            <input
                                                type='hidden'
                                                value='${review.subRating.cleanliness}'
                                                className='cleanliness-rating'
                                            />
                                            <input
                                                type='hidden'
                                                value='${review.subRating.contact}'
                                                className='contact-rating'
                                            />
                                            <input
                                                type='hidden'
                                                value='${review.subRating.checkin}'
                                                className='checkin-rating'
                                            />
                                            <input
                                                type='hidden'
                                                value='${review.subRating.accuracy}'
                                                className='accuracy-rating'
                                            />
                                            <input
                                                type='hidden'
                                                value='${review.subRating.location}'
                                                className='location-rating'
                                            />
                                            <input
                                                type='hidden'
                                                value='${review.subRating.value}'
                                                className='value-rating'
                                            />
                                            <div
                                                className='normal-flex'
                                                style='margin-bottom: 20px'
                                            >
                                                <div className='customerAvatarWrapper'>
                                                    <img
                                                        src='@{${review.booking.customer.avatarPath}}'
                                                        alt=''
                                                        className='normal-img'
                                                    />
                                                </div>
                                                <div style=''>
                                                    <div style='font-weight: 600'>
                                                        review.booking.customer.fullName
                                                    </div>
                                                    <div
                                                        text="${#dates.format(review.createdDate,
                                                    'dd-MM-yyyy')}"
                                                        style='color: #717171; font-size: 14px'
                                                    ></div>
                                                </div>
                                            </div>
                                            <div style={{ maxWidth: '457px' }}>review.comment</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div id='rdt__location'>
                                <div className='rdt_amentity__header'>Nơi bạn sẽ đến</div>
                                <div id='map'></div>
                            </div>
                            <div className='rdt_host rdt_body__common'>
                                <div className='host_info'>
                                    <div>
                                        <img
                                            src='@{${room.host.avatarPath}}'
                                            alt=''
                                            className='image'
                                            width='64px'
                                            height='64px'
                                            style={{ borderRadius: '50%' }}
                                        />
                                    </div>
                                    <div style={{ marginLeft: '20px' }}>
                                        <h2 className='room-hostName'>{room?.host_name}</h2>
                                        <div className='room-createdDate'>
                                            room.host.createdDate
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='rdt_rules rdt_body__common'>
                                <h4 className='rdt_amentity__header'>Những điều cần biết</h4>
                                {room?.rules.map(rule => {
                                    return (
                                        <div
                                            className='normal-flex'
                                            style={{ marginBottom: '8px' }}
                                        >
                                            <span>{rule.title}</span>
                                            <span style={{ paddingLeft: '16px' }}>
                                                {rule.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </main>
                </div>
            </main>
        </>
    );
};

export default RoomDetails;
