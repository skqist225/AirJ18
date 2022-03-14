import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImage } from '../../helpers';
import NumberFormat from 'react-number-format';
import { IRoom } from '../../types/room/type_Room';
import $ from 'jquery';
import './css/home.css';
interface IRoomsProps {
    room: IRoom;
    index: number;
}

export const Room: FC<IRoomsProps> = ({ room, index }) => {
    const getIndex = (array: JQuery<HTMLElement>, index: number): number => {
        array.each(function () {
            if ($(this).hasClass('active')) {
                index = parseInt($(this).data('index')!);
                $(this).removeClass('active');
                return false;
            }
        });

        return index;
    };
    const addActiveClass = (array: JQuery<HTMLElement>, index: number) => {
        array.each(function () {
            if (parseInt($(this).data('index')!) === index) $(this).addClass('active');
        });
    };

    function changeImage(self: JQuery<HTMLElement>, className: string) {
        let index: number = -1;

        const functionName: string = self.data('function-name');
        const roomId: number = self.data('room-id');

        let roomImages: JQuery<HTMLElement> =
            roomId !== undefined ? $(`.${className}${roomId}`) : $(`.${className}`);

        index = getIndex(roomImages, index);

        if (functionName === 'nextImage' && ++index > roomImages.length) index = 1;
        if (functionName === 'prevImage' && --index === 0) index = roomImages.length;

        addActiveClass(roomImages, index);
    }

    const jQuerycode = async () => {
        $('.img_idt').each(function () {
            if (parseInt($(this).data('index')) === 1) $(this).addClass('active');
        });
    };

    useEffect(() => {
        jQuerycode();
    }, []);

    return (
        <div className='room__container'>
            <div className='room__image__container'>
                <Link to={`room/${room.id}`}>
                    <div className='image__slider'>
                        {room.images.map((image: string, idx: number) => (
                            <img
                                src={getImage(image)}
                                data-index={idx + 1}
                                className={`room__image${index + 1} img_idt`}
                                style={{ objectFit: 'cover' }}
                                key={image + idx}
                            />
                        ))}
                    </div>
                </Link>
                <div className='room__changeImage__pseudoContainer'>
                    <div className='room__changeImage'>
                        <button
                            className={'prevImgBtn'}
                            data-room-id={index + 1}
                            data-function-name='prevImage'
                            onClick={e => {
                                e.preventDefault();
                                changeImage($(e.currentTarget), 'room__image');
                            }}
                        >
                            <svg
                                viewBox='0 0 16 16'
                                role='presentation'
                                aria-hidden='true'
                                focusable='false'
                                style={{
                                    height: '10px',
                                    width: '10px',
                                    display: 'block',
                                }}
                            >
                                <path d='m10.8 16c-.4 0-.7-.1-.9-.4l-6.8-6.7c-.5-.5-.5-1.3 0-1.8l6.8-6.7c.5-.5 1.2-.5 1.7 0s .5 1.2 0 1.7l-5.8 5.9 5.8 5.9c.5.5.5 1.2 0 1.7-.2.3-.5.4-.8.4'></path>
                            </svg>
                        </button>
                        <div
                            style={{ flex: '1', cursor: 'pointer', height: '50px' }}
                            data-room-id={room.id}
                            onClick={() => {
                                window.location.href = `room/${room.id}`;
                            }}
                        ></div>
                        <button
                            className={'nextImgBtn'}
                            data-room-id={index + 1}
                            data-function-name='nextImage'
                            onClick={e => {
                                e.preventDefault();
                                changeImage($(e.currentTarget), 'room__image');
                            }}
                        >
                            <span>
                                <svg
                                    viewBox='0 0 16 16'
                                    role='presentation'
                                    aria-hidden='true'
                                    focusable='false'
                                    className='nextImageSvg'
                                >
                                    <path d='m5.3 16c .3 0 .6-.1.8-.4l6.8-6.7c.5-.5.5-1.3 0-1.8l-6.8-6.7c-.5-.5-1.2-.5-1.7 0s-.5 1.2 0 1.7l5.8 5.9-5.8 5.9c-.5.5-.5 1.2 0 1.7.2.3.5.4.9.4'></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
                <div className='room__button__like__container'>
                    <button className='room__likeBtn' data-room-id={room.id}>
                        <svg
                            viewBox='0 0 32 32'
                            xmlns='http://www.w3.org/2000/svg'
                            aria-hidden='true'
                            role='presentation'
                            focusable='false'
                            className='heartSvg'
                        >
                            <path d='m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z'></path>
                        </svg>
                    </button>
                </div>
            </div>
            <Link to={'room/' + room.id}>
                <div className='normal-flex' style={{ padding: '15px 0 0 0' }}>
                    <div className='room__name'>{room.name}</div>
                    <div className='room__price'>
                        <NumberFormat
                            value={room.price}
                            prefix={room.currencySymbol}
                            thousandSeparator={true}
                            displayType={'text'}
                            renderText={(formattedValue: any) => (
                                <div>
                                    {formattedValue}/{room.stayType}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </Link>
        </div>
    );
};
