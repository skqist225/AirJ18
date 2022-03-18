import { FC } from 'react';
import { ManageYSContainer } from '.';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers';

import './css/edit_image.css';

interface IEditImageProps {
    images: string[];
    roomid: number;
}

const EditImage: FC<IEditImageProps> = ({ images, roomid }) => {
    function redirectToPhotoPage() {
        window.location.href = `${window.location.origin}/manage-your-space/${roomid}/details/photos`;
    }

    return (
        <ManageYSContainer className='manage--ys__section' height='239px' id='roomImages'>
            <div className='flex-space' style={{ marginBottom: '20px' }}>
                <div className='manage--ys__section--title'>Ảnh</div>
                <div>
                    <button className='manage--ys__transparentBtn' onClick={redirectToPhotoPage}>
                        <span>Chỉnh sửa</span>
                        <span>
                            <Image src={getImage('/svg/next.svg')} size='12px' />
                        </span>
                    </button>
                </div>
            </div>
            <div className='normal-flex p-relative overflow-hidden'>
                {images.map(image => (
                    <div className='mr-10' key={image}>
                        <img
                            src={getImage(image)}
                            alt=''
                            width='210px'
                            height='140px'
                            style={{
                                objectFit: 'cover',
                                borderRadius: '8px',
                                verticalAlign: 'bottom',
                            }}
                        />
                    </div>
                ))}

                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '0',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <button className='manage--ys__transparentBtn morClass'>
                        <span>{images.length} ảnh</span>
                    </button>
                </div>
            </div>
        </ManageYSContainer>
    );
};

export default EditImage;
