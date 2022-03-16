import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Div } from '../../globalStyle';
import { getImage } from '../../helpers';
import { IRoomDetails } from '../../types/room/type_RoomDetails';

interface IRoomImagesProps {
    room: IRoomDetails;
}

const RoomImages: FC<IRoomImagesProps> = ({ room }) => {
    return (
        <section className='rdt_images grid'>
            <Div height='480px'>
                <img
                    src={getImage(room!.thumbnail)}
                    className='image w100-h100'
                    alt={room!.thumbnail}
                />
            </Div>
            <div className='p-relative'>
                <Div className='rdt_images__left' height={'470px'}>
                    {room!.images.map((image: string, index: number) => {
                        if (index > 3) return null;

                        return (
                            <Div height='calc(470px / 2)' key={image + index}>
                                <img
                                    src={getImage(image)}
                                    className={
                                        index % 2 === 0
                                            ? 'roundedBorder image w100-h100'
                                            : 'image w100-h100'
                                    }
                                    alt={image}
                                />
                            </Div>
                        );
                    })}
                </Div>
                <Link to={`${room!.id}/images`}>
                    <div className='rdt_showMoreImage'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 17 17'
                            role='presentation'
                            aria-hidden='true'
                            focusable='false'
                            style={{
                                height: '12px',
                                width: '12px',
                                display: 'block',
                            }}
                        >
                            <circle cx='1.5' cy='1.5' r='1.5'></circle>
                            <circle cx='1.5' cy='8.5' r='1.5'></circle>
                            <circle cx='8.5' cy='1.5' r='1.5'></circle>
                            <circle cx='8.5' cy='8.5' r='1.5'></circle>
                            <circle cx='15.5' cy='1.5' r='1.5'></circle>
                            <circle cx='15.5' cy='8.5' r='1.5'></circle>
                            <circle cx='1.5' cy='15.5' r='1.5'></circle>
                            <circle cx='8.5' cy='15.5' r='1.5'></circle>
                            <circle cx='15.5' cy='15.5' r='1.5'></circle>
                        </svg>
                        <div style={{ paddingLeft: '12px' }}>Hiển thị tất cả ảnh</div>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default RoomImages;
