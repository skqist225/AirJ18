import { FC } from 'react';
import { seperateNumber } from '../../helpers';

import { PaymentElement } from '@stripe/react-stripe-js';

interface IPaymentInfoProps {
    roomPrice: number;
    numberOfNights: number;
}

const PaymentInfo: FC<IPaymentInfoProps> = ({ roomPrice, numberOfNights }) => {
    let totalPrice = 0;
    // jQuery(document).on('ready', function () {
    //     const totalRoomPrice = roomPrice * numberOfNights;
    //     const siteFee = totalRoomPrice * 0.05;
    //     totalPrice = totalRoomPrice + siteFee;

    //     $('#totalRoomPrice').text(seperateNumber(totalRoomPrice));
    //     $('#siteFee').text(seperateNumber(Math.ceil(siteFee)));
    //     $('#totalPrice').text(seperateNumber(Math.ceil(totalPrice)));

    //     const postObj = {
    //         price: totalPrice,
    //         currency: roomCurrency,
    //     };

    //     let elements;

    //     initialize();
    //     checkStatus();

    //     document.querySelector('#payment-form').addEventListener('submit', handleSubmit);
    //     // Fetches a payment intent and captures the client secret
    //     async function initialize() {
    //         const response = await fetch(`${baseURL}api/create-payment-intent`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(postObj),
    //         });
    //         const { clientSecret } = await response.json();

    //         const appearance = {
    //             theme: 'stripe',
    //         };
    //         elements = stripe.elements({ appearance, clientSecret });

    //         const paymentElement = elements.create('payment');
    //         paymentElement.mount('#payment-element');
    //     }

    //     async function handleSubmit(e) {
    //         e.preventDefault();
    //         setLoading(true);

    //         const { data } = await axios.get(
    //             `${baseURL}booking/${roomId}/create?checkin=${checkinPlain}&checkout=${checkoutPlain}&numberOfDays=${numberOfNights}&siteFee=${siteFee}`
    //         );

    //         if (data !== null) {
    //             await axios.put(`${baseURL}bookings`, [data]);

    //             const { error } = await stripe.confirmPayment({
    //                 elements,
    //                 confirmParams: {
    //                     return_url: `${window.location.origin}${baseURL}booking/success-booking`,
    //                 },
    //             });

    //             if (error.type === 'card_error' || error.type === 'validation_error') {
    //                 showMessage(error.message);
    //             } else {
    //                 showMessage('An unexpected error occured.');
    //             }

    //             setLoading(false);
    //         } else {
    //             alert('Phòng này đã được đặt');
    //             setLoading(false);
    //         }
    //     }

    //     // Fetches the payment intent status after payment submission
    //     async function checkStatus() {
    //         const clientSecret = new URLSearchParams(window.location.search).get(
    //             'payment_intent_client_secret'
    //         );

    //         if (!clientSecret) {
    //             return;
    //         }

    //         const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    //         switch (paymentIntent.status) {
    //             case 'succeeded':
    //                 showMessage('Payment succeeded!');
    //                 break;
    //             case 'processing':
    //                 showMessage('Your payment is processing.');
    //                 break;
    //             case 'requires_payment_method':
    //                 showMessage('Your payment was not successful, please try again.');
    //                 break;
    //             default:
    //                 showMessage('Something went wrong.');
    //                 break;
    //         }
    //     }

    //     // ------- UI helpers -------

    //     function showMessage(messageText) {
    //         const messageContainer = document.querySelector('#payment-message');

    //         messageContainer.classList.remove('hidden');
    //         messageContainer.textContent = messageText;

    //         setTimeout(function () {
    //             messageContainer.classList.add('hidden');
    //             messageText.textContent = '';
    //         }, 4000);
    //     }

    //     // Show a spinner on payment submission
    //     function setLoading(isLoading) {
    //         if (isLoading) {
    //             // Disable the button and show a spinner
    //             document.querySelector('#submit').disabled = true;
    //             document.querySelector('#spinner').classList.remove('hidden');
    //             document.querySelector('#button-text').classList.add('hidden');
    //         } else {
    //             document.querySelector('#submit').disabled = false;
    //             document.querySelector('#spinner').classList.add('hidden');
    //             document.querySelector('#button-text').classList.remove('hidden');
    //         }
    //     }
    // });

    return (
        <div style={{ marginTop: '50px' }}>
            <form id='payment-form'>
                <PaymentElement />
                <button>Submit</button>
            </form>
        </div>
    );
};

export default PaymentInfo;
