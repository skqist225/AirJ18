import { FC } from 'react';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers';

interface IViewRoomProps {
    status: boolean;
}

const ViewRoom: FC<IViewRoomProps> = ({ status }) => {
    return (
        <div className='flex-space' style={{ marginBottom: '48px' }}>
            <div className='normal-flex'>
                <div>
                    <button className='manage--ys__transparentBtn'>
                        <span>
                            {status === false ? (
                                <Image src={getImage('/svg/reddot.svg')} size='10px' />
                            ) : (
                                <Image src={getImage('/svg/greendot.svg')} size='10px' />
                            )}
                        </span>
                        <span>{status == false ? 'Đã hủy đăng' : 'Đang đăng'}</span>
                    </button>
                </div>
                <div>
                    <button className='manage--ys__transparentBtn'>
                        <span>
                            <Image src={getImage('/svg/thunder.svg')} size='10px' />
                        </span>
                        <span>Chế độ đặt ngay đang bật</span>
                    </button>
                </div>
            </div>
            <div>
                {/*onclick="previewRoom();" */}
                <button className='manage-ys__preview-room-btn'>
                    Xem trước nhà phòng cho thuê
                </button>
            </div>
        </div>
    );
};

export default ViewRoom;
