import { FC } from 'react';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers';

interface IPaymentErrorProps {}

const PaymentError: FC<IPaymentErrorProps> = () => {
    return (
        <section className='progress--booking__payment--error'>
            <div className='flex'>
                <div className='progress--booking__error--wrapper'>
                    <Image src={getImage('/svg/error.svg')} size='16px' />
                </div>
                <div>
                    <div className='fs-14 fw-600' style={{ marginBottom: '4px' }}>
                        Hãy thử lại lần nữa
                    </div>
                    <div className='fs-14' style={{ color: '#717171', lineHeight: '16px' }}>
                        Vui lòng kiểm tra thông tin thanh toán của bạn.
                    </div>
                </div>
                <div>
                    <button className='progress--booking__transparentBtn'>
                        <span>
                            <Image src={getImage('/svg/close2.svg')} size='16px' />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PaymentError;
