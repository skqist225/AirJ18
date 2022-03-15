import { FC } from 'react';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers';

interface IAcceptPolicyProps {}

const AcceptPolicy: FC<IAcceptPolicyProps> = () => {
    return (
        <section className='progress--booking__infoSection'>
            <Div className='normal-flex' padding='24px 0'>
                <div style={{ marginRight: '20px' }}>
                    <Image src={getImage('/svg/cancel_policy.svg')} size='32px' />
                </div>
                <div className='fs-16'>
                    Đặt phòng/đặt chỗ của bạn sẽ không được xác nhận cho đến khi chủ nhà/người tổ
                    chức chấp nhận yêu cầu của bạn (trong vòng 24 giờ). Bạn sẽ không bị trừ tiền cho
                    đến lúc đó.
                </div>
            </Div>
        </section>
    );
};

export default AcceptPolicy;
