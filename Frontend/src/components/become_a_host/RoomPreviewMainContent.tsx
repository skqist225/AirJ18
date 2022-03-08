import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import { RootState } from '../../store';
import './css/room_preview_main_content.css';

interface IRoomPreviewMainContentProps {}

const RoomPreviewMainContent: FC<IRoomPreviewMainContentProps> = () => {
    const { user } = useSelector((state: RootState) => state.user);
    return (
        <div className='room-preview__container'>
            <div className='room-preview__wrapper'>
                <div id='room-preview__room-thumbnail'>
                    <img
                        src=''
                        alt=''
                        id='roomThumbnail'
                        className='of-c'
                        width='100%'
                        height='229px'
                    />
                </div>
                <div id='room-preview__room-title' className='room-preview__line'></div>
                <div className='room-preview__line flex'>
                    <div id='room-preview__room-type'></div>
                    <Image
                        src={getImage(user!.avatarPath)}
                        size='40px'
                        className='of-c rounded-border inline-block '
                        style={{ justifySelf: 'flex-end' }}
                    />
                </div>
                <div id='room-preview__room-info' className='room-preview__line'></div>
                <div id='room-preview__room-description' className='room-preview__line'></div>
                <div id='room-preview__room-price' className='room-preview__line'></div>
                <div id='room-preview__room-amentities' className='room-preview__line'>
                    <div className='room-preview__amentity-title'>Tiện nghi</div>
                    <div>
                        <div className='flex room-preview__amentity-container'>
                            <div id='prominentAmentityName'></div>
                            <div>
                                <img
                                    src=''
                                    alt=''
                                    id='prominentAmentity'
                                    width='52px'
                                    height='52px'
                                />
                            </div>
                        </div>
                        <div className='flex room-preview__amentity-container'>
                            <div id='favoriteAmentityName'></div>
                            <div>
                                <img
                                    src=''
                                    alt=''
                                    id='favoriteAmentity'
                                    width='24px'
                                    height='24px'
                                    style={{ marginRight: '10px' }}
                                />
                            </div>
                        </div>
                        <div className='flex room-preview__amentity-container'>
                            <div id='safeAmentityName'></div>
                            <div>
                                <img
                                    src=''
                                    alt=''
                                    id='safeAmentity'
                                    width='24px'
                                    height='24px'
                                    style={{ marginRight: '10px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    id='room-preview__room-location'
                    style={{ margin: '0 24px', paddingBottom: '24px' }}
                >
                    <h2>Vị trí</h2>
                    <div id='room-preview__room-location-txt'></div>
                </div>
            </div>
        </div>
    );
};

export default RoomPreviewMainContent;
