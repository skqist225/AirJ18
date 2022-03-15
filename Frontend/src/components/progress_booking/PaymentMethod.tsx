import { Radio } from 'antd';
import { FC } from 'react';
import { seperateNumber } from '../../helpers';
import { IRoomDetails } from '../../types/room/type_RoomDetails';
import { MyNumberForMat } from '../utils';
import PaymentMethodOption from './components/PaymentMethodOption';

interface IPaymentMethodProps {
    totalPrice: number;
    siteFee: number;
    cleanFee: number;
    room: IRoomDetails;
}

const PaymentMethod: FC<IPaymentMethodProps> = ({ totalPrice, siteFee, room, cleanFee }) => {
    return (
        <section className='progress--booking__infoSection'>
            <div>Chọn cách thanh toán</div>
            <div className='progress--booking__pm--select'>
                <PaymentMethodOption
                    paymentMethodTitle='Trả toàn bộ'
                    price={totalPrice}
                    currencySymbol={room!.currencySymbol}
                    description='   Thanh toán toàn bộ số tiền ngay bây giờ và bạn đã sẵn sàng.'
                />
                <PaymentMethodOption
                    paymentMethodTitle='Trả ngay một phần, phần còn lại trả sau'
                    price={(totalPrice - siteFee - cleanFee) / 2 + siteFee + cleanFee}
                    currencySymbol={room!.currencySymbol}
                    description={`Thanh toán ngay ${room!.currencySymbol}${seperateNumber(
                        Math.floor((totalPrice - siteFee - cleanFee) / 2 + siteFee + cleanFee)
                    )} và phần còn lại (${room!.currencySymbol}${seperateNumber(
                        Math.floor(
                            totalPrice -
                                Math.floor(
                                    (totalPrice - siteFee - cleanFee) / 2 + siteFee + cleanFee
                                )
                        )
                    )}) sẽ tự
                        động được trừ vào cùng phương thức thanh toán này vào 27 thg 5, 2022. Không
                        phát sinh phụ phí.`}
                />
            </div>
        </section>
    );
};

export default PaymentMethod;
