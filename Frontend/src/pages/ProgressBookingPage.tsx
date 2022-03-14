import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import PaymentInfo from '../components/progress_booking/PaymentInfo';
import PreviewBookingInfo from '../components/progress_booking/PreviewBookingInfo';
import { fetchRoomById, roomState } from '../features/room/roomSlice';
import { Div, Image } from '../globalStyle';
import { getImage } from '../helpers';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import './css/progress_booking.css';

interface IProgressBookingPageProps {}

const ProgressBookingContainer = styled(Div).attrs(props => ({
    className: 'col-flex-center',
    width: '1440px',
    margin: '0 auto',
    padding: '64px 80px',
}))``;

const PBTitleSection = styled.div.attrs(props => ({
    className: 'normal-flex',
}))`
    justify-content: flex-start;
    width: 100%;
    padding-bottom: 32px;

    button {
        display: inline-block;
        padding-right: 32px;
    }

    h1 {
        cursor: pointer;
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 0;
    }
`;

const PBRoomInfo = styled(Div).attrs(props => ({
    className: 'start-flex',
}))``;

const PBRoomThumbnail = styled.img`
    width: 124px;
    height: 106px;
    object-fit: cover;
    vertical-align: bottom;
    border-radius: 10px;
`;

const stripePromise = loadStripe(
    'pk_test_51I0IBMJc966wyBI6MIJecSCfMv7UPan6N0DVxro4nTDYIAQKJOiANIUQotSTu0NP99C5tuKPHdaWCrei9iR2ASsH00gRiN3lVe'
);

const ProgressBookingPage: FC<IProgressBookingPageProps> = () => {
    const dispatch = useDispatch();
    const { pathname, search } = useLocation();
    const roomid = pathname.split('/').pop()!;

    // const clientSecret = stripePromise.client_secret;
    // const options = {
    //     // passing the client secret obtained from the server
    //     clientSecret:
    //         'sk_test_51I0IBMJc966wyBI6039Fz6Dj8JFQDWPt1H3cuWpLFpllfefWEnSb5eSfcdNH1L4bNhqyu5W3UEEjJWxdqchYWeQV00TROMqWL9',
    // };

    const params: Map<string, string> = new Map();
    const urlSearchParams = search.split('?')[1].split('&');
    for (const param of urlSearchParams) {
        params.set(param.split('=')[0], param.split('=')[1]);
    }

    const [checkinDate, setCheckinDate] = useState<string>(params.get('checkin')!.toString());
    const [checkoutDate, setCheckoutDate] = useState<string>(params.get('checkout')!.toString());
    const [numberOfNights, setNumberOfNights] = useState<number>(
        parseInt(params.get('numberOfNights')!)
    );

    useEffect(() => {
        dispatch(fetchRoomById({ roomid }));
    }, []);
    const { room } = useSelector(roomState);

    function backToRoomDetails() {
        window.location.href = '/room/' + roomid;
    }

    return (
        <div className='p-relative'>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            {room && (
                <div id='main'>
                    <ProgressBookingContainer>
                        <PBTitleSection>
                            <button
                                onClick={backToRoomDetails}
                                className='booking__transparent-btn'
                            >
                                <Image src={getImage('/svg/close3.svg')} size='16px' />
                            </button>
                            <h1>Yêu cầu đặt phòng/đặt chỗ • AirJ18</h1>
                        </PBTitleSection>
                        <PBRoomInfo>
                            <div className='f1' style={{ maxWidth: '45%' }}>
                                <section className='progress--booking__infoSection'>
                                    <div>Chuyến đi của bạn</div>
                                    <PreviewBookingInfo
                                        title='Ngày'
                                        info={`${checkinDate} - ${checkoutDate}`}
                                    />
                                    <PreviewBookingInfo title='Khách' info={`${1} khách`} />
                                </section>
                                <section className='progress--booking__infoSection'>
                                    <div>Chọn cách thanh toán</div>
                                </section>
                                <section className='progress--booking__infoSection'>
                                    <div>Thanh toán bằng</div>
                                    <div>
                                        <Elements stripe={stripePromise} options={options}>
                                            <PaymentInfo
                                                roomPrice={room.price}
                                                numberOfNights={numberOfNights}
                                            />
                                        </Elements>
                                    </div>
                                </section>
                                <section className='progress--booking__infoSection'>
                                    <div>Bắt buộc cho chuyến đi của bạn</div>
                                </section>
                                <section className='progress--booking__infoSection'>
                                    <div>Chính sách hủy</div>
                                </section>

                                <Div>
                                    <button
                                        type='submit'
                                        className='rdt_booking_button'
                                        id='submit'
                                    >
                                        <div className='spinner hidden' id='spinner'></div>
                                        <span>
                                            <span></span>
                                        </span>
                                        <span id='button-text'>
                                            Yêu cầu đặt phòng/đặt chỗ • AirJ18
                                        </span>
                                    </button>
                                </Div>
                            </div>
                            <div className='f1' style={{ maxWidth: '5%' }}></div>
                            <div className='flex-1'>
                                <div id='boxPreview'>
                                    <div id='boxPreview-header'>
                                        <div>
                                            <PBRoomThumbnail src={getImage(room!.thumbnail)} />
                                        </div>
                                        <div>
                                            <div className='fs-14'>
                                                {room!.privacy} tại
                                                {/* {room.ca} */}
                                            </div>
                                            <div>{room!.name}</div>
                                        </div>
                                    </div>
                                    <div id='boxPreview-body' style={{ paddingTop: '24px' }}>
                                        <div className='booking__price-details-title'>
                                            Chi tiết giá
                                        </div>
                                        <div className='previewPrice-line'>
                                            <div className='flex-space'>
                                                <div>
                                                    <div
                                                        style={{ color: 'rgb(32, 32, 32)' }}
                                                        className='fs-16 fw-400'
                                                    >
                                                        {room!.currencySymbol}x
                                                        <span id='numberOfNight'>
                                                            ${numberOfNights}
                                                        </span>
                                                        &nbsp;đêm&nbsp;
                                                    </div>
                                                </div>
                                                <div className='fs-16 fw-400'>
                                                    {room!.currencySymbol}
                                                    <span id='totalRoomPrice'></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='previewPrice-line'>
                                            <div className='flex-space'>
                                                <div>
                                                    <div
                                                        style={{
                                                            color: 'rgb(32, 32, 32)',
                                                            textDecoration: 'underline',
                                                        }}
                                                        className='fs-16 fw-400'
                                                    >
                                                        Phí dịch vụ
                                                    </div>
                                                </div>
                                                <div className='fs-16 fw-400'>
                                                    {room!.currencySymbol}
                                                    <span id='siteFee'></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id='boxPreview-footer' className='flex-space'>
                                        <div className='fs-16 fw-600'>
                                            Tổng(
                                            <span style={{ textDecoration: 'underline' }}>
                                                {/* {room.currency.unit} */}
                                            </span>
                                            )
                                        </div>
                                        <div className='fs-16 fw-600'>
                                            {room!.currencySymbol}
                                            <span id='totalPrice'></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PBRoomInfo>
                    </ProgressBookingContainer>
                </div>
            )}
        </div>
    );
};

export default ProgressBookingPage;
