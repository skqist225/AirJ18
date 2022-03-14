import { Radio } from 'antd';
import { FC } from 'react';
import { MyNumberForMat } from '../../utils';

interface IPaymentMethodOptionProps {
    paymentMethodTitle: string;
    price: number;
    currencySymbol: string;
    description: string;
}

const PaymentMethodOption: FC<IPaymentMethodOptionProps> = ({
    paymentMethodTitle,
    description,
    price,
    currencySymbol,
}) => {
    return (
        <div className='progress--booking__pm--header'>
            <div className='flex-space'>
                <div className='fs-16 fw-600'>{paymentMethodTitle}</div>
                <div className='normal-flex'>
                    <MyNumberForMat
                        isPrefix
                        removeStayType
                        price={price}
                        currency={currencySymbol}
                        priceFontSize='16px'
                        priceFontWeight='600'
                    />
                    <Radio.Group size='large' buttonStyle='solid' style={{ marginLeft: '10px' }}>
                        {' '}
                        <Radio className='payment--method__radioBtn' />
                    </Radio.Group>
                </div>
            </div>
            <div className='progress--booking__pm--description'>{description}</div>
        </div>
    );
};

export default PaymentMethodOption;
