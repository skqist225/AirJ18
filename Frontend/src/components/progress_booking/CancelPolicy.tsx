import { FC } from 'react';
import { Div } from '../../globalStyle';

interface ICancelPolicyProps {
    date: number;
    month: number;
}

const CancelPolicy: FC<ICancelPolicyProps> = ({ date, month }) => {
    return (
        <section className='progress--booking__infoSection'>
            <div className='fs-22 fw-600'>Chính sách hủy</div>

            <Div padding='0 0 24px 0' className='fs-16'>
                <span className='fw-600 '>Miễn phí hủy trong 48 giờ.</span> Sau đó, hủy trước 13:00
                ngày {date} tháng {month} để được hoàn lại 50%, trừ phí dịch vụ.
            </Div>
        </section>
    );
};

export default CancelPolicy;
