import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userState } from '../../features/user/userSlice';
import { Image } from '../../globalStyle';
import { getImage, seperateNumber } from '../../helpers';

import $ from 'jquery';
import './css/room_preview_main_content.css';

interface IRoomPreviewMainContentProps {}

const RoomPreviewMainContent: FC<IRoomPreviewMainContentProps> = () => {
    const { user } = useSelector(userState);

    useEffect(() => {
        if (localStorage.getItem('room')) {
            const room = JSON.parse(localStorage.getItem('room')!);
            const privacyType = room.privacyType + '';

            $('#roomThumbnail').attr(
                'src',
                getImage(`/room_images/${user?.email}/${room.roomImages[0]}`)
            );
            $('#room-preview__room-title').text(room.roomTitle);

            $('#room-preview__room-type').text(
                `${privacyType.substring(0, privacyType.lastIndexOf(' '))} ${
                    room.roomGroupText
                } cho thuê. Chủ nhà ${room.username}`
            );
            $('#room-preview__room-info').text(
                `${room.guestNumber} khách · ${room.bedRoomNumber} phòng ngủ  · ${room.bedNumber} giường · ${room.bathRoomNumber} phòng tắm`
            );
            $('#room-preview__room-description').text(
                `Thư giãn tại địa điểm nghỉ dưỡng ${room.descriptions[0]
                    .toString()
                    .toLowerCase()} và ${room.descriptions[1].toString().toLowerCase()} này.`
            );

            $('#room-preview__room-price').text(seperateNumber(room.roomPricePerNight) + 'đ / đêm');

            /*-------------------------------AMENTITIES-----------------------------------------*/
            $('#prominentAmentity').attr(
                'src',
                getImage(`/amentity_images/${room.prominentAmentityImageName}`)
            );
            $('#favoriteAmentity').attr(
                'src',
                getImage(`/amentity_images/${room.favoriteAmentityImageName}`)
            );
            $('#safeAmentity').attr(
                'src',
                getImage(`/amentity_images/${room.safeAmentityImageName}`)
            );
            $('#prominentAmentityName').text(room.prominentAmentityName);
            $('#favoriteAmentityName').text(room.favoriteAmentityName);
            $('#safeAmentityName').text(room.safeAmentityName);
            /*-------------------------------AMENTITIES-----------------------------------------*/

            /*-------------------------------LOCATION-----------------------------------------*/
            $('#room-preview__room-location-txt').text(room.placeName);
            /*-------------------------------LOCATION-----------------------------------------*/
        } else {
            window.location.href = window.location.origin;
        }
    }, []);

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
