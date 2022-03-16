import TextArea from 'antd/lib/input/TextArea';
import { FC } from 'react';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers';
import { IRoomDetails } from '../../types/room/type_RoomDetails';

interface IContactHostProps {
    room: IRoomDetails;
}

const ContactHost: FC<IContactHostProps> = ({ room }) => {
    return (
        <section className='progress--booking__infoSection'>
            <div>Bắt buộc cho chuyến đi của bạn</div>

            <div>
                <div>
                    <div className='fs-16 fw-600'>Nhắn tin cho chủ nhà</div>
                    <div className='fs-14'>
                        Cho chủ nhà biết lý do bạn đi du lịch và thời điểm nhận phòng.
                    </div>
                </div>

                <Div className='normal-flex' padding='16px 0 32px'>
                    <div style={{ marginRight: '16px' }}>
                        <Image
                            src={getImage(room!.host.avatar)}
                            size='50px'
                            className='rounded-border'
                        />
                    </div>
                    <div>
                        <div className='fs-16 fw-500'>{room!.host.name}</div>
                        <div className='fs-14'>
                            Tham gia vào năm {room!.host.createdDate.split('-')[2]}
                        </div>
                    </div>
                </Div>

                <Div margin='0 0 24px'>
                    <TextArea
                        rows={4}
                        style={{ borderRadius: '16px !important' }}
                        id='clientMessage'
                    />
                </Div>
            </div>
        </section>
    );
};

export default ContactHost;
