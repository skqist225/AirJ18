import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchRoomById } from '../../features/room/roomSlice';
import { getImage } from '../../helpers/getImage';
import { RootState } from '../../store';
import { IRoomDetails } from '../../type/type_RoomDetails';
import { getRoomlocation } from '../../utils/getLocation';
import Header from '../Header';
import { MyNumberForMat } from '../../components/utils';
import { ReviewLine, Amenity, ReviewValue, Rule } from './components';
import roomDetails from './script/room_details';
import 'alertifyjs/build/css/alertify.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './css/room_details.css';

interface IRoomDetailsProps {}

const RoomDetails: FC<IRoomDetailsProps> = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const { room, loading }: { room: IRoomDetails; loading: boolean } = useSelector(
        (state: RootState) => state.room
    );

    const jQuerycode = () => {
        roomDetails(room!.price, room!.bookedDates);
    };

    const leftReviewLines = [
        {
            title: 'Mức độ sạch sẽ',
            id: 'cleanlinessRating',
        },
        {
            title: 'Liên lạc',
            id: 'contactRating',
        },
        {
            title: 'Nhận phòng',
            id: 'checkinRating',
        },
    ];

    const rightReviewLines = [
        {
            title: 'Độ chính xác',
            id: 'accuracyRating',
        },
        {
            title: 'Vị trí',
            id: 'locationRating',
        },
        {
            title: 'Giá trị',
            id: 'valueRating',
        },
    ];

    useEffect(() => {
        dispatch(fetchRoomById({ roomid: pathname.split('/')[2] }));
    }, [dispatch, pathname]);

    useEffect(() => {
        if (room !== null) {
            getRoomlocation(
                room.latitude,
                room.longitude,
                room.host.id,
                room.host.avatar,
                room.host.name
            );

            jQuerycode();
        }
    }, [room]);

    return (
        <>
            <Header excludeBecomeHostAndNavigationHeader={true} includeMiddle={false} />
            {room !== null && loading === false && (
                <main>
                    <div id='rdt__header--container'>
                        <h1 className='rdt__header--name'>{room.name}</h1>
                        <input type='hidden' id='roomId' value={room.id} />
                        <div className='rdt_below__header flex'>
                            <div className='rdt_location__info text'>
                                <span>{room.location}</span>
                            </div>
                            <div className='rdt_header__action'>
                                <button
                                    className='room__likeBtn rdt_button__action'
                                    data-room-id={room.id}
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
                                    src={getImage(room.thumbnail)}
                                    width='100%'
                                    height='100%'
                                    className='image'
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div className='rdt_images__left' style={{ height: '470px' }}>
                                    {room.images.map((image: string, index: number) => (
                                        <div
                                            style={{ width: '100%', height: 'calc(470px / 2)' }}
                                            key={image + index}
                                        >
                                            <img
                                                src={getImage(image)}
                                                style={{ width: '100%', height: '100%' }}
                                                className={
                                                    index % 2 === 0
                                                        ? 'roundedBorder image'
                                                        : 'image'
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Link to={`${room.id}/images`}>
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
                                        <div style={{ paddingLeft: '12px' }}>
                                            Hiển thị tất cả ảnh
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </section>

                        <div className='rdt_body'>
                            <div className='grid__2_1'>
                                <article>
                                    <div className='rdt_room__count flex'>
                                        <div>
                                            <h2 className='rdt__body--hostDetails'>
                                                {room.privacy} tại {room.name}. Chủ nhà
                                                {room.host.name}
                                            </h2>
                                            <p className='rdt__body--room-infos'>
                                                {room.guest} khách · {room.bedroom} phòng ngủ ·{' '}
                                                {room.bed} giường · {room.bathroom} phòng tắm riêng
                                            </p>
                                        </div>
                                        <div>
                                            <img
                                                src={getImage(room.host.avatar)}
                                                alt="host's avatar"
                                                className='rdt__host--avatar'
                                            />
                                        </div>
                                    </div>
                                    <div className='rdt__description rdt_body__common'>
                                        <p>{room.description}</p>
                                    </div>
                                    <div className='rdt_bedroom_info rdt_body__common'>
                                        <div className='rdt_amentity__header'>
                                            Nơi bạn sẽ ngủ nghỉ
                                        </div>
                                        <div className='rdt_room__decor'>
                                            <div
                                                className='normal-flex'
                                                style={{
                                                    marginBottom: '16px',
                                                }}
                                            >
                                                {/* {Array.from({ length: room.bed }).map(_ => (
                                                <span>
                                                    <svg
                                                        viewBox='0 0 32 32'
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        aria-hidden='true'
                                                        role='presentation'
                                                        focusable='false'
                                                        style={{
                                                            display: 'block',
                                                            height: '24px',
                                                            width: '24px',
                                                        }}
                                                    >
                                                        <path d='M24 4a2 2 0 0 1 1.995 1.85L26 6v7.839l1.846 5.537a3 3 0 0 1 .115.468l.03.24.009.24V30h-2v-2H6v2H4v-9.675a3 3 0 0 1 .087-.717l.067-.232L6 13.836V6a2 2 0 0 1 1.697-1.977l.154-.018L8 4zm2 18H6v4h20zm-1.388-6H7.387l-1.333 4h19.891zM24 6H8v8h3v-4a2 2 0 0 1 1.85-1.995L13 8h6a2 2 0 0 1 1.995 1.85L21 10v4h3zm-5 4h-6v4h6z'></path>
                                                    </svg>{' '}
                                                </span>
                                            ))} */}
                                            </div>
                                            <div
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                Phòng ngủ
                                            </div>
                                            <div style={{ fontSize: '1.4rem' }}>
                                                <span>{room.bed}</span>
                                                giường đơn
                                            </div>
                                        </div>
                                    </div>
                                    <div className='rdt_amentity rdt_body__common'>
                                        <h4 className='rdt_amentity__header'>
                                            Nơi này có những gì cho bạn
                                        </h4>
                                        <div className='rdt__amenities--container'>
                                            {room.amenitities.map(amenity => (
                                                <Amenity amenity={amenity} key={amenity.name} />
                                            ))}
                                        </div>
                                    </div>
                                    <div id='rdt_calender'>
                                        <div>
                                            <div className='rdt__body--calendar__chooseStartDateTitle'>
                                                Chọn ngày nhận phòng
                                            </div>
                                            <div
                                                className='rdt__body--calendar__chooseEndDateTitle'
                                                id='numberOfDaysContainer'
                                            >
                                                <span id='daysAtHere'>1</span> đêm tại
                                                room.city.name
                                            </div>
                                        </div>
                                        <div style={{ color: '#717171' }}>
                                            <div id='beforeEndDateContainer'>
                                                <span
                                                    id='beforeChooseDay'
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    Thêm ngày đi để biết giá chính xác
                                                </span>
                                            </div>
                                            <div
                                                style={{ display: 'none' }}
                                                id='fromDayToDayContainer'
                                            >
                                                <span id='fromDay'>Từ ngày</span> -
                                                <span id='toDay'>đến ngày</span>
                                            </div>
                                        </div>
                                        <div className='rdt_calender__header'>
                                            <div className='flex3'>
                                                <div className='firstMonth'>
                                                    <div className='normal-flex'>
                                                        <div>
                                                            <button
                                                                type='button'
                                                                className={
                                                                    'getThePrevTwoMonth' +
                                                                    ' getMonth-btn'
                                                                }
                                                            >
                                                                <span>
                                                                    <img
                                                                        src={getImage(
                                                                            '/svg/close3.svg'
                                                                        )}
                                                                        width='12px'
                                                                        height='12px'
                                                                    />
                                                                </span>
                                                            </button>
                                                        </div>

                                                        <div className='monthTitle firstMonthAndYear'>
                                                            Tháng MM năm YYY
                                                        </div>
                                                    </div>
                                                    <div className='rdt_calender__body'>
                                                        <div
                                                            className='flex3'
                                                            style={{ width: 'calc(44px * 7)' }}
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
                                                    <div className='normal-flex'>
                                                        <div className='pseudoContainer'>
                                                            <div className='secondMonthAndYear monthTitle'>
                                                                Tháng MM + 1 năm YYYY
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <button
                                                                type='button'
                                                                className={
                                                                    'getTheNextTwoMonth' +
                                                                    ' getMonth-btn'
                                                                }
                                                            >
                                                                <span>
                                                                    <img
                                                                        src={getImage(
                                                                            '/svg/nextMonth.svg'
                                                                        )}
                                                                        width='12px'
                                                                        height='12px'
                                                                    />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='rdt_calender__body'>
                                                        <div
                                                            className='flex3'
                                                            style={{ width: 'calc(44px * 7)' }}
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

                                <article className='rdt__booking'>
                                    <div className='rdt__booking--container'>
                                        <div style={{ marginBottom: '24px' }}>
                                            <MyNumberForMat
                                                price={room.price}
                                                currency={room.currency}
                                                stayType={room.stay_type}
                                            />
                                        </div>
                                        <div className='rdt__booking--receiveRoom'>
                                            <div className='flex'>
                                                <div
                                                    style={{
                                                        padding: '10px 12px 10px',
                                                        width: '50%',
                                                    }}
                                                >
                                                    <div style={{ fontWeight: 600 }}>
                                                        Nhận phòng
                                                    </div>
                                                    <div id='checkinDate'>Thêm ngày</div>
                                                </div>
                                                <div
                                                    style={{
                                                        padding: '10px 12px 10px',
                                                        width: '50%',
                                                        borderLeft:
                                                            '0.5px solid rgb(211, 211, 211)',
                                                    }}
                                                >
                                                    <div style={{ fontWeight: '600' }}>
                                                        Trả phòng
                                                    </div>
                                                    <div id='checkoutDate'>Thêm ngày</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type='submit'
                                                className='rdt_booking_button'
                                                // onClick='processBooking();'
                                            >
                                                <span>
                                                    <span
                                                        style={{
                                                            backgroundPosition:
                                                                'calc((100 - 96.4371) * 1%) calc((100 - 50) * 1%)',
                                                        }}
                                                    ></span>
                                                </span>
                                                <span>Đặt phòng</span>
                                            </button>
                                        </div>
                                        <div
                                            className='previewPrice-line'
                                            style={{ marginTop: '20px' }}
                                        >
                                            <div className='flex-space'>
                                                <div>
                                                    <button className='rdt_transparent__btn'>
                                                        <div
                                                            style={{
                                                                color: 'rgb(32, 32, 32)',
                                                                fontSize: '14px',
                                                            }}
                                                        >
                                                            <MyNumberForMat
                                                                price={room.price}
                                                                currency={room.currency}
                                                                stayType={room.stay_type}
                                                            />{' '}
                                                            x<span id='numberOfNight'>7</span>
                                                            &nbsp;đêm&nbsp;
                                                        </div>
                                                    </button>
                                                </div>
                                                <div style={{ fontSize: '14px' }}>
                                                    {room.currency}
                                                    <span id='totalPrice'></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='previewPrice-line'>
                                            <div className='flex-space'>
                                                <div>
                                                    <button className='rdt_transparent__btn'>
                                                        <div
                                                            style={{
                                                                color: 'rgb(32, 32, 32)',
                                                                fontSize: '14px',
                                                                textDecoration: 'underline',
                                                            }}
                                                        >
                                                            Phí dịch vụ
                                                        </div>
                                                    </button>
                                                </div>
                                                <div style={{ fontSize: '14px' }}>
                                                    {room.currency}
                                                    <span id='siteFee'></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex' style={{ paddingTop: '16px' }}>
                                            <div className='totalPriceTitle'>Tổng</div>
                                            <div className='totalPriceTitle'>
                                                {room.currency}
                                                <span id='finalTotalPrice'></span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                            <div id='rdt__review'>
                                <div>
                                    <div className='normal-flex'>
                                        <img
                                            src={getImage('/svg/star.svg')}
                                            width='16px'
                                            height='16px'
                                        />
                                        <span
                                            style={{
                                                fontWeight: '600',
                                                fontSize: '22px',
                                                display: 'inline-block',
                                                marginLeft: '12px',
                                            }}
                                        >
                                            {room.reviews.length > 0 && (
                                                <span>{room.average_rating}</span>
                                            )}

                                            <span>{room.reviews.length || 0} đánh giá</span>
                                        </span>
                                    </div>
                                    <div className='normal-flex' style={{ marginBottom: '42px' }}>
                                        <div style={{ flex: '1', maxWidth: '50%' }}>
                                            {leftReviewLines.map(({ title, id }) => (
                                                <ReviewLine title={title} id={id} key={title} />
                                            ))}
                                        </div>
                                        <div className='avgRatingWrapper'>
                                            {rightReviewLines.map(({ title, id }) => (
                                                <ReviewLine title={title} id={id} key={title} />
                                            ))}
                                        </div>
                                    </div>
                                    <div id='ratingDetailsContainer'>
                                        {room.reviews.map(review => (
                                            <div
                                                className='rdt__review-box'
                                                key={review.created_at}
                                            >
                                                {Object.keys(review.rating).map(k => {
                                                    return (
                                                        <ReviewValue
                                                            value={(review.rating as any)[k]}
                                                            className={`${k}-rating`}
                                                            key={k}
                                                        />
                                                    );
                                                })}
                                                <div
                                                    className='normal-flex'
                                                    style={{ marginBottom: '20px' }}
                                                >
                                                    <div className='customerAvatarWrapper'>
                                                        <img
                                                            src={getImage(review.customer_avatar)}
                                                            className='normal-img'
                                                        />
                                                    </div>
                                                    <div>
                                                        <div
                                                            style={{
                                                                fontWeight: 600,
                                                                fontSize: '1.6rem',
                                                            }}
                                                        >
                                                            {review.customer_name}
                                                        </div>
                                                        <div
                                                            style={{
                                                                color: '#717171',
                                                                fontSize: '1.4rem',
                                                            }}
                                                        >
                                                            {review.created_at}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        maxWidth: '457px',
                                                        fontSize: '1.6rem',
                                                    }}
                                                >
                                                    {review.comment}
                                                </div>
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
                                                src={getImage(room.host.avatar)}
                                                className='rdt__host--avatar'
                                            />
                                        </div>
                                        <div style={{ marginLeft: '20px' }}>
                                            <h2 className='room-hostName'>{room.host.name}</h2>
                                            <div className='room-createdDate'>
                                                {room.host.created_date}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='rdt_rules rdt_body__common'>
                                    <h4 className='rdt_amentity__header'>Những điều cần biết</h4>
                                    {room.rules.map(rule => (
                                        <Rule rule={rule} key={rule.title} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default RoomDetails;
