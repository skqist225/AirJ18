import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { fetchRoomById, roomState } from '../features/room/roomSlice';
import { userState } from '../features/user/userSlice';
import { Div, Image } from '../globalStyle';
import { getImage } from '../helpers';
import initComp, { uploadImagesToFolder } from './script/manage_photos';

import $ from 'jquery';
import './css/manage_photos.css';
import Toast from '../components/notify/Toast';
import axios from '../axios';

interface IManageRoomPhotosPageProps {}

const ManageRoomPhotosPage: FC<IManageRoomPhotosPageProps> = () => {
    const dispatch = useDispatch();
    const { roomid } = useParams();
    const { room } = useSelector(roomState);
    const { user } = useSelector(userState);

    useEffect(() => {
        dispatch(fetchRoomById({ roomid: roomid! }));
    }, []);

    useEffect(() => {
        if (user && room) initComp(user, room);
    }, [user, room]);

    function previewRoom() {
        window.location.href = `${window.location.origin}/room/${room?.id}`;
    }

    function hideEditThumbnailBox() {
        $('.radioThumbnail').each(function () {
            if ($(this).val() === room?.thumbnail.split('/').pop()!) {
                $(this).prop('checked', true);
            } else $(this).prop('checked', false);
        });

        $('#chooseRoomThumbnail').css('display', 'none');
    }

    async function saveNewThumbnail() {
        const postURL = `/manage-your-space/update/${room?.id}/${'thumbnail'}`;
        const thumbnailName = $('input[type="radio"]:checked').val();

        const { data } = await axios.post(
            postURL,
            {
                thumbnail: thumbnailName,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (data === 'OK') {
            window.location.href = `${window.location.origin}/manage-your-space/${room?.id}/details/photos`;
        }
    }

    function backToEditPage() {
        window.location.href = `${window.location.origin}/manage-your-space/${room?.id}/details`;
    }

    function uploadImages() {
        uploadImagesToFolder(user!, room!);
    }

    function displayEditThumbnailBox() {
        $('#chooseRoomThumbnail').css('display', 'block');
    }

    return (
        <Div className='p-relative' height='100vh'>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            <div id='main'>
                <div id='manage-photos__container'>
                    <div className='manage-ys__left'>
                        <div id='roomName'>{room?.name}</div>
                        <div className='manage-ys__left-scrolling-menu'>
                            <div className='manage-ys__left-room-details normal-flex'>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        marginRight: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={backToEditPage}
                                >
                                    <Image src={getImage('/svg/close3.svg')} size='15px' />{' '}
                                </span>
                                <span className='inline-block'>Ảnh</span>
                            </div>
                            <div style={{ height: 'fit-content' }} className='menuContainer'>
                                <ul style={{ height: '100%' }}>
                                    <li className='active' data-index='1'>
                                        <div className='li-before'></div>
                                        <a
                                            className='manage-ys__changeView'
                                            data-scroll='#roomThumbnail'
                                        >
                                            Ảnh bìa
                                        </a>
                                    </li>
                                    <li data-index='2'>
                                        <div className='li-before'></div>
                                        <a
                                            className='manage-ys__changeView'
                                            data-scroll='#roomAllImages'
                                        >
                                            Tất cả ảnh
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='manage-ys__right'>
                        <div style={{ maxWidth: '869px' }}>
                            <div className='flex-space' style={{ marginBottom: '48px' }}>
                                <div className='normal-flex'>
                                    <div>
                                        <button className='manage-ys__transparent-btn'>
                                            <span>
                                                {!room?.status ? (
                                                    <Image
                                                        src={getImage('/svg/reddot.svg')}
                                                        size='10px'
                                                    />
                                                ) : (
                                                    <Image
                                                        src={getImage('/svg/greendot.svg')}
                                                        size='10px'
                                                    />
                                                )}
                                            </span>
                                            <span>
                                                {' '}
                                                <span>
                                                    {!room?.status ? 'Đã hủy đăng' : 'Đang đăng'}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                    <div>
                                        <button className='manage-ys__transparent-btn'>
                                            <span>
                                                <Image
                                                    src={getImage('/svg/thunder.svg')}
                                                    size='10px'
                                                />
                                            </span>
                                            <span>Chế độ đặt ngay đang bật</span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className='manage-photos__normal-btn'
                                        onClick={previewRoom}
                                    >
                                        Xem trước nhà phòng cho thuê
                                    </button>
                                </div>
                            </div>

                            <div
                                className='normal-flex'
                                style={{
                                    borderBottom: '1px solid rgb(211, 211, 211)',
                                    height: '328px',
                                }}
                            >
                                <div className='flex-50'>
                                    <div className='manage-photos__title' id='roomThumbnail'>
                                        Ảnh bìa
                                    </div>
                                    <div
                                        className='manage-photos__subtitle'
                                        style={{ marginTop: '15px' }}
                                    >
                                        Ảnh bìa là ấn tượng đầu tiên của khách về nhà/phòng cho thuê
                                        của bạn.
                                    </div>
                                    <div style={{ marginTop: '30px' }}>
                                        <button
                                            className='manage-photos__normal-btn'
                                            onClick={displayEditThumbnailBox}
                                        >
                                            Thay đổi ảnh
                                        </button>
                                    </div>
                                </div>
                                <div className='flex-50' id='thumbnailPhotos'></div>
                            </div>

                            <div style={{ marginTop: '50px' }}>
                                <div className='flex-space'>
                                    <div className='manage-photos__title' id='roomAllImages'>
                                        Tất cả ảnh
                                    </div>
                                    <div>
                                        <button
                                            className='manage-photos__normal-btn'
                                            onClick={uploadImages}
                                        >
                                            <Image
                                                src={getImage('/amentity_images/upload.svg')}
                                                size='22px'
                                            />
                                            <span>Tải ảnh lên</span>
                                        </button>
                                    </div>
                                </div>
                                <div id='photosContainer__body'>
                                    <input
                                        type='file'
                                        name='room_photos'
                                        id='uploadPhotos'
                                        accept='images/*'
                                        hidden
                                        multiple
                                    />
                                    <div id='subImages'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='chooseRoomThumbnail'>
                <div className='flex flex jc-center'>
                    <div className='innerWrapper'>
                        <div id='boxHeader' className='normal-flex'>
                            <div onClick={hideEditThumbnailBox}>
                                <Image
                                    src={getImage('/svg/close2.svg')}
                                    size='16px'
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <div className='manage-photos__title jc-center flex f1'>
                                Chọn ảnh bìa
                            </div>
                        </div>
                        <div id='boxBody'>
                            <div className='grid-3'>
                                {room?.images.map(image => (
                                    <div
                                        key={image}
                                        style={{
                                            width: 'calc(712px / 3)',
                                            height: 'calc(296px / 2)',
                                            position: 'relative',
                                        }}
                                    >
                                        <img src={getImage(image)} className='w-100 h-100 of-c' />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                left: '8px',
                                            }}
                                        >
                                            <input
                                                type='radio'
                                                className='radioThumbnail'
                                                value='${image.image}'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div id='boxFooter' className='flex-space'>
                            <div>
                                <button className='manage-ys__transparent-btn'>Tải ảnh lên</button>
                                <button
                                    className='manage-photos__cancel-btn'
                                    onClick={hideEditThumbnailBox}
                                >
                                    Hủy
                                </button>
                            </div>
                            <div>
                                <button
                                    className='manage-photos__save-edit-btn'
                                    onClick={saveNewThumbnail}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast />
        </Div>
    );
};

export default ManageRoomPhotosPage;
