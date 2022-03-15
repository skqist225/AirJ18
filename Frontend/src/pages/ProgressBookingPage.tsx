import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import {
    CancelPolicy,
    ContactHost,
    PaymentError,
    PaymentMethod,
    PreviewBookingInfo,
    RoomAndPricePreview,
    AcceptPolicy,
} from '../components/progress_booking';
import { fetchRoomById, roomState } from '../features/room/roomSlice';
import { Div, Image } from '../globalStyle';
import { getImage } from '../helpers';
import { loadStripe } from '@stripe/stripe-js';
import { bookingState, getStripeClientSecret } from '../features/booking/bookingSlice';
import { Input } from 'antd';

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

const stripePromise = loadStripe(
    'pk_test_51I0IBMJc966wyBI6MIJecSCfMv7UPan6N0DVxro4nTDYIAQKJOiANIUQotSTu0NP99C5tuKPHdaWCrei9iR2ASsH00gRiN3lVe'
);
const { TextArea } = Input;

const ProgressBookingPage: FC<IProgressBookingPageProps> = () => {
    const dispatch = useDispatch();
    const { pathname, search } = useLocation();
    const roomid = pathname.split('/').pop()!;
    const { clientSecret } = useSelector(bookingState);

    const options = {
        // passing the client secret obtained from the server
        clientSecret,
    };

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
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [siteFee, setSiteFee] = useState<number>(0);
    const [cleanFee, setCleanFee] = useState<number>(0);

    useEffect(() => {
        dispatch(fetchRoomById({ roomid }));
    }, []);
    const { room } = useSelector(roomState);

    useEffect(() => {
        if (room) {
            dispatch(
                getStripeClientSecret({
                    currency: room.currencyUnit.toLowerCase(),
                    price: room.price,
                })
            );
            setSiteFee((room.price * 10) / 100);
            setCleanFee((room.price * 5) / 100);
            setTotalPrice(room.price * numberOfNights + siteFee + cleanFee);
        }
    }, [room]);

    function backToRoomDetails() {
        window.location.href = '/room/' + roomid;
    }

    let fromDateToDate = '';
    const [ciDate, ciMonth, ciYear] = checkinDate.split('-');
    const [coDate, coMonth, coYear] = checkoutDate.split('-');
    if (ciMonth === coMonth && ciYear === coYear)
        fromDateToDate = `Ngày ${ciDate} - Ngày ${coDate} thg ${ciMonth}`;
    else if (ciMonth !== coMonth && ciYear === coYear)
        fromDateToDate = `Ngày ${ciDate} thg ${ciMonth} - Ngày ${coDate} thg ${coMonth}`;
    else
        fromDateToDate = `Ngày ${ciDate} thg ${ciMonth} năm ${ciMonth} - Ngày ${coDate} thg ${coMonth} năm ${coMonth}`;

    let ciDateNumber = parseInt(ciDate);
    let beforeCheckinDate7Days = 0;
    let beforeCheckinDateMonth = 0;
    let i = 7;

    const lastDateOfPrevMonth = new Date(parseInt(ciYear), parseInt(ciMonth) - 1, 0).getDate();
    if (ciDateNumber - 7 < 0) {
        while (ciDateNumber-- >= 0) {
            i--;
        }
        beforeCheckinDate7Days = lastDateOfPrevMonth - i;
        beforeCheckinDateMonth = parseInt(ciMonth) - 1;
    } else {
        beforeCheckinDate7Days = ciDateNumber - 7;
        beforeCheckinDateMonth = parseInt(ciMonth);
    }

    return (
        <div className='p-relative' id='progress--booking'>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            {room && (
                <div id='main'>
                    <ProgressBookingContainer>
                        <PBTitleSection>
                            <button
                                onClick={backToRoomDetails}
                                className='progress--booking__transparentBtn'
                            >
                                <Image src={getImage('/svg/close3.svg')} size='16px' />
                            </button>
                            <h1>Yêu cầu đặt phòng/đặt chỗ • AirJ18</h1>
                        </PBTitleSection>
                        <PBRoomInfo>
                            <div className='f1' style={{ maxWidth: '45%' }}>
                                <PaymentError />
                                <section className='progress--booking__infoSection'>
                                    <div>Chuyến đi của bạn</div>
                                    <PreviewBookingInfo
                                        title='Ngày'
                                        text={fromDateToDate}
                                        componentName='calendar'
                                        room={room}
                                    />
                                    <PreviewBookingInfo
                                        title='Khách'
                                        text={`${1} khách`}
                                        componentName='guest'
                                        room={room}
                                    />
                                </section>
                                <PaymentMethod
                                    siteFee={siteFee}
                                    cleanFee={cleanFee}
                                    totalPrice={totalPrice}
                                    room={room}
                                />
                                <section className='progress--booking__infoSection'>
                                    <div>Thanh toán bằng</div>
                                    <div>
                                        {/* {clientSecret && (
                                            <Elements stripe={stripePromise} options={options}>
                                                <PaymentInfo
                                                    roomPrice={room.price}
                                                    numberOfNights={numberOfNights}
                                                />
                                            </Elements>
                                        )} */}
                                    </div>
                                </section>
                                <ContactHost room={room} />
                                <CancelPolicy
                                    date={beforeCheckinDate7Days}
                                    month={beforeCheckinDateMonth}
                                />
                                <AcceptPolicy />

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
                            <RoomAndPricePreview
                                room={room}
                                numberOfNights={numberOfNights}
                                totalPrice={totalPrice}
                                cleanFee={cleanFee}
                            />
                        </PBRoomInfo>
                    </ProgressBookingContainer>
                </div>
            )}
        </div>
    );
};

export default ProgressBookingPage;
