import { FC } from 'react';
import { seperateNumber } from '../../helpers';

import { PaymentElement } from '@stripe/react-stripe-js';

interface IPaymentInfoProps {}

const PaymentInfo: FC<IPaymentInfoProps> = () => {
    return (
        <div style={{ marginTop: '50px' }}>
            <form id='payment-form'>
                <PaymentElement />
            </form>
        </div>
    );
};

export default PaymentInfo;
