import { FC } from 'react';
import styled from 'styled-components';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers';
import { IRoomDetails } from '../../types/room/type_RoomDetails';
import { MyNumberForMat } from '../utils';

const PBRoomThumbnail = styled.img`
    width: 124px;
    height: 106px;
    object-fit: cover;
    vertical-align: bottom;
    border-radius: 10px;
`;

interface IRoomAndPricePreviewProps {
    room: IRoomDetails;
    numberOfNights: number;
    totalPrice: number;
    cleanFee: number;
}

const RoomAndPricePreview: FC<IRoomAndPricePreviewProps> = ({
    room,
    numberOfNights,
    totalPrice,
    cleanFee,
}) => {
    return (
        <div className='flex-1'>
            <div id='boxPreview'>
                <div id='boxPreview-header'>
                    <div>
                        <PBRoomThumbnail src={getImage(room!.thumbnail)} />
                    </div>
                    <Div className='col-flex' style={{ justifyContent: 'space-between' }}>
                        <div>
                            <div className='fs-12'>{room?.category}</div>
                            <div className='fw-500'>{room!.name}</div>
                        </div>
                        <div className='normal-flex'>
                            <div className='flex-center'>
                                <Image src={getImage('/svg/star.svg')} size='12px' />
                            </div>
                            <span
                                style={{
                                    fontWeight: '500',
                                    fontSize: '12px',
                                    display: 'inline-block',
                                    marginLeft: '12px',
                                }}
                            >
                                {room!.reviews.length ? (
                                    <span>{room!.averageRating}</span>
                                ) : (
                                    <span>0.0</span>
                                )}
                                <span style={{ color: 'rgb(113,133,133)' }}>
                                    ({room!.reviews.length || 0} đánh giá)
                                </span>
                            </span>
                        </div>
                    </Div>
                </div>
                <div id='boxPreview-body' style={{ paddingTop: '24px' }}>
                    <div className='booking__price-details-title'>Chi tiết giá</div>
                    <div className='previewPrice-line'>
                        <div className='flex-space'>
                            <div>
                                <div
                                    style={{ color: 'rgb(32, 32, 32)' }}
                                    className='fs-16 fw-400 normal-flex'
                                >
                                    <MyNumberForMat
                                        isPrefix
                                        removeStayType
                                        currency={room!.currencySymbol}
                                        price={room!.price}
                                        priceFontSize='16px'
                                    />
                                    <div>
                                        &nbsp;
                                        <span>x</span>&nbsp;
                                        <span>{numberOfNights}</span>
                                        &nbsp;đêm&nbsp;
                                    </div>
                                </div>
                            </div>
                            <div className='fs-16 fw-400'>
                                <MyNumberForMat
                                    isPrefix
                                    removeStayType
                                    currency={room!.currencySymbol}
                                    price={room!.price * numberOfNights}
                                    priceFontSize='16px'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='previewPrice-line' style={{ borderBottom: 'none' }}>
                        <div className='flex-space'>
                            <div>
                                <div
                                    style={{
                                        color: 'rgb(32, 32, 32)',
                                        textDecoration: 'underline',
                                    }}
                                    className='fs-16 fw-400'
                                >
                                    Phí vệ sinh
                                </div>
                            </div>
                            <div className='fs-16 fw-400'>
                                <MyNumberForMat
                                    isPrefix
                                    removeStayType
                                    currency={room!.currencySymbol}
                                    price={cleanFee}
                                    priceFontSize='16px'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='previewPrice-line' style={{ borderBottom: 'none' }}>
                        <div className='flex-space'>
                            <div>
                                <div
                                    style={{
                                        color: 'rgb(32, 32, 32)',
                                        textDecoration: 'underline',
                                    }}
                                    className='fs-16 fw-400'
                                >
                                    Phí dịch vụ
                                </div>
                            </div>
                            <div className='fs-16 fw-400'>
                                <MyNumberForMat
                                    isPrefix
                                    removeStayType
                                    currency={room!.currencySymbol}
                                    price={(room!.price * 10) / 100}
                                    priceFontSize='16px'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div id='boxPreview-footer' className='flex-space'>
                    <div className='fs-16 fw-600'>
                        Tổng&nbsp;(
                        <span style={{ textDecoration: 'underline' }}>{room?.currencyUnit}</span>)
                    </div>
                    <div>
                        <MyNumberForMat
                            isPrefix
                            removeStayType
                            currency={room!.currencySymbol}
                            price={totalPrice}
                            priceFontSize='16px'
                            priceFontWeight='600'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomAndPricePreview;
