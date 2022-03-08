import { FC } from 'react';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import './css/room_images_main_content.css';

interface IPropertyRoomImagesMainContentProps {}

const PropertyRoomImagesMainContent: FC<IPropertyRoomImagesMainContentProps> = () => {
    return (
        <>
            <div
                className='drag_n_drop_zone'
                // ondragover='dragoverHandler(event)'
                // ondrop='dropHandler(event)'
            >
                <div>
                    <Image src={getImage('/amentity_images/photos.svg')} size='64px' />
                </div>
                <div className='photos__drag-title'>Kéo ảnh của bạn vào đây</div>
                <div>Thêm ít nhất 5 ảnh</div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button className='photos__btn__load-images' id='triggerUploadPhotosInput'>
                        Tải lên từ thiết bị của bạn
                    </button>
                    <input
                        type='file'
                        name='room_photos'
                        id='uploadPhotos'
                        accept='images/*'
                        hidden
                        multiple
                    />
                </div>
            </div>
            <div id='editor' className='photosContainer'>
                <div className='flex-space'>
                    <div>
                        <div
                            style={{
                                fontSize: '22px',
                                color: '#222',
                                fontWeight: '500',
                                lineHeight: '16px',
                            }}
                            id='addAtLeast5Images'
                        >
                            Thêm ít nhất 5 ảnh
                        </div>
                        <div
                            style={{
                                color: 'rgb(113, 113, 113)',
                                paddingTop: '4px',
                                fontWeight: '400',
                            }}
                        >
                            Kéo để sắp xếp lại
                        </div>
                    </div>
                    <div>
                        {/*onclick='uploadImagesToFolder();' */}
                        <button className='upload__btn'>
                            <Image src={getImage('/amentity_images/upload.svg')} size='22px' />
                            <span>Tải lên</span>
                        </button>
                    </div>
                </div>
                <div id='photosContainer__body'>
                    <div id='thumbnailPhotos'>
                        <div className='thumbnail-title'>Ảnh bìa</div>
                    </div>
                    <div id='subImages'></div>
                </div>
            </div>
        </>
    );
};

export default PropertyRoomImagesMainContent;
