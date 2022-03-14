import { FC } from 'react';

interface IPreviewBookingInfoProps {
    title: string;
    info: string;
}

const PreviewBookingInfo: FC<IPreviewBookingInfoProps> = ({ title, info }) => {
    return (
        <div className='flex-space' style={{ paddingBottom: '24px' }}>
            <div className='col-flex'>
                <div className='fs-16 fw-600'>{title}</div>
                <div className='checkinAndcheckoutTitle'>{info}</div>
            </div>
            <div>
                <button className='booking__transparent-btn'>Chỉnh sửa</button>
            </div>
        </div>
    );
};

export default PreviewBookingInfo;
