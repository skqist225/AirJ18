import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import {
    CancelPolicy,
    ContactHost,
    PaymentError,
    PaymentMethod,
    PreviewBookingInfo,
    RoomAndPricePreview,
    AcceptPolicy,
    PaymentInfo,
    ProgressBookingContainer,
    PBTitleSection,
    PBRoomInfo,
} from "../components/progress_booking";
import { fetchRoomById, roomState } from "../features/room/roomSlice";
import { Div, Image } from "../globalStyle";
import { getImage, useURLParams } from "../helpers";
import { loadStripe } from "@stripe/stripe-js";
import {
    bookingState,
    createBooking,
    getStripeClientSecret,
} from "../features/booking/bookingSlice";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import {
    calculateBeforeCheckinDateDateAndMonth,
    getFormattedCheckinAndCheckoutDate,
} from "./script/progress_booking";

import $ from "jquery";
import "./css/progress_booking.css";
import { PaymentElement } from "@stripe/react-stripe-js";

interface IProgressBookingPageProps {}

const stripePromise = loadStripe(
    "pk_test_51I0IBMJc966wyBI6MIJecSCfMv7UPan6N0DVxro4nTDYIAQKJOiANIUQotSTu0NP99C5tuKPHdaWCrei9iR2ASsH00gRiN3lVe"
);

const ProgressBookingPage: FC<IProgressBookingPageProps> = () => {
    const dispatch = useDispatch();
    const { pathname, search } = useLocation();
    const roomid = pathname.split("/").pop()!;
    const { clientSecret, newlyCreatedBooking } = useSelector(bookingState);
    const { room } = useSelector(roomState);
    const params = useURLParams(search);

    const checkinDate = params.get("checkin")!;
    const checkoutDate = params.get("checkout")!;
    const numberOfNights = parseInt(params.get("numberOfNights")!);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [siteFee, setSiteFee] = useState<number>(0);
    const [cleanFee, setCleanFee] = useState<number>(0);

    useEffect(() => {
        dispatch(fetchRoomById({ roomid }));
    }, [roomid]);

    useEffect(() => {
        if (newlyCreatedBooking) {
            window.location.href = `${window.location.origin}/user/booked-rooms`;
        }
    }, [newlyCreatedBooking]);

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

    const fromDateToDate = getFormattedCheckinAndCheckoutDate(checkinDate, checkoutDate);
    const [beforeCheckinDateDate, beforeCheckinDateMonth] =
        calculateBeforeCheckinDateDateAndMonth(checkinDate);

    console.log(checkinDate);
    console.log(checkoutDate);
    function makeBooking() {
        dispatch(
            createBooking({
                roomid: room!.id,
                checkinDate,
                checkoutDate,
                numberOfDays: numberOfNights,
                clientMessage: $("#clientMessage").text()!,
            })
        );
    }

    console.log(clientSecret);

    return (
        <div className='p-relative' id='progress--booking'>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            {room && (
                <div id='main'>
                    <ProgressBookingContainer>
                        <PBTitleSection>
                            <Link
                                to={`/room/${room.id}`}
                                className='progress--booking__transparentBtn'
                            >
                                <Image src={getImage("/svg/close3.svg")} size='16px' />
                            </Link>
                            <h1>Yêu cầu đặt phòng/đặt chỗ • AirJ18</h1>
                        </PBTitleSection>
                        <PBRoomInfo>
                            <div className='f1' style={{ maxWidth: "45%" }}>
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
                                {/* <Elements stripe={stripePromise} options={options}>
                                    <CheckoutForm />
                                </Elements> */}
                                {/* <PaymentMethod
                                    siteFee={siteFee}
                                    cleanFee={cleanFee}
                                    totalPrice={totalPrice}
                                    room={room}
                                /> */}
                                <section className='progress--booking__infoSection'>
                                    <div style={{ paddingBottom: "0px !important" }}>
                                        Thanh toán bằng
                                    </div>
                                    <div>
                                        {clientSecret && (
                                            <Elements
                                                stripe={stripePromise}
                                                options={{ clientSecret }}
                                            >
                                                <PaymentInfo />
                                            </Elements>
                                        )}
                                    </div>
                                </section>
                                <ContactHost room={room} />
                                <CancelPolicy
                                    date={beforeCheckinDateDate}
                                    month={beforeCheckinDateMonth}
                                />
                                <AcceptPolicy />

                                <Div>
                                    <button
                                        type='submit'
                                        className='rdt_booking_button'
                                        id='submit'
                                        onClick={makeBooking}
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
                            <div className='f1' style={{ maxWidth: "5%" }}></div>
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
