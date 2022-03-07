import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import { RootState } from '../../store';
import { IncAndDecBtn } from '../hosting/listings/IncAndDecBtn';
import { Switch } from 'antd';
import { Checkbox } from 'antd';
import { Slider } from 'antd';
import $ from 'jquery';
import { seperateNumber } from '../../helpers/seperateNumber';

interface IFilterRoomBoxProps {}

const FilterRoomBox: FC<IFilterRoomBoxProps> = () => {
    const { roomPrivacies } = useSelector((state: RootState) => state.room);
    const { amenities } = useSelector((state: RootState) => state.amenity);

    function hideEditThumbnailBox() {
        // $('.radioThumbnail').each(function () {
        //     if ($(this).val() === thumbnail) {
        //         $(this).prop('checked', true);
        //     } else $(this).prop('checked', false);
        // });

        $('#chooseRoomThumbnail').css('display', 'none');
        $('#home__mainContainer').removeClass('remove-scroll');
    }
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10_000_000);

    function onChange(checked: any) {
        console.log(`switch to ${checked}`);
    }

    function sliderOnChange(value: [number, number]) {
        setMinPrice(value[0]);
        setMaxPrice(value[1]);
    }

    return (
        <>
            <div id='chooseRoomThumbnail'>
                <div className='flex-center h-100'>
                    <Div
                        width='780px'
                        height='calc(65px + calc(739px + 81px))'
                        className='innerWrapper'
                    >
                        <div
                            id='boxHeader'
                            className='normal-flex'
                            onClick={() => hideEditThumbnailBox()}
                        >
                            <div>
                                <Image
                                    src={getImage('/svg/close2.svg')}
                                    size='16px'
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <div className='index__box-header-title flex-center'>Bộ lọc</div>
                        </div>
                        <div id='boxBody'>
                            <div className='index__filter-block'>
                                <div className='index__box-filter-title'>Loại nơi ở</div>
                                <div className='grid-2'>
                                    {roomPrivacies.map(privacy => (
                                        <div
                                            className='col-flex'
                                            style={{
                                                padding: '12px 0',
                                            }}
                                            key={privacy.id}
                                        >
                                            <div>
                                                <Checkbox
                                                    onChange={onChange}
                                                    value={privacy.id}
                                                    className='fs-18'
                                                >
                                                    {privacy.name}
                                                </Checkbox>
                                            </div>
                                            <div style={{ marginLeft: '25px' }}>
                                                <div className='fs-14' style={{ marginTop: '4px' }}>
                                                    {privacy.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='index__filter-block'>
                                <div className='index__box-filter-title'>Khoảng giá</div>
                                <div>
                                    <div>
                                        Giá trung bình hàng đêm là
                                        <span>đ</span>[[$
                                        {/* {#numbers.formatDecimal(
                                                    averageRoomPrice,
                                                    3,
                                                    'POINT',
                                                    0,
                                                    'COMMA'
                                                )}
                                                ]] */}
                                    </div>
                                    <Div className='flex-center' height='50px'>
                                        <Slider
                                            defaultValue={[0, 10000000]}
                                            tooltipVisible={true}
                                            min={0}
                                            max={10000000}
                                            step={500000}
                                            range={{ draggableTrack: true }}
                                            style={{ width: '400px' }}
                                            onChange={sliderOnChange}
                                            value={[minPrice, maxPrice]}
                                        />
                                    </Div>
                                    <div className='flex-center'>
                                        <div className='min-price-button'>
                                            <div className='min-price-title'>giá tối thiểu</div>
                                            <div className='normal-flex'>
                                                <span>đ</span>
                                                <input
                                                    type='text'
                                                    className='min-price-input'
                                                    id='min-input__modify'
                                                    value={seperateNumber(minPrice)}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div style={{ margin: '8px' }}>-</div>
                                        <div className='max-price-button'>
                                            <div className='max-price-title'>giá tối đa</div>
                                            <div className='normal-flex'>
                                                <span>đ</span>
                                                <input
                                                    type='text'
                                                    className='max-price-input'
                                                    id='max-input__modify'
                                                    value={seperateNumber(maxPrice)}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='index__filter-block'>
                                <div>
                                    <div className='index__box-filter-title'>Đặt ngay</div>
                                    <div className='flex-space'>
                                        <div className='fs-16'>
                                            Nhà/phòng cho thuê bạn có thể đặt mà không cần chờ chủ
                                            nhà chấp thuận
                                        </div>
                                        <div>
                                            <Switch defaultChecked onChange={onChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='index__filter-block'>
                                <div>
                                    <div className='index__box-filter-title'>
                                        Phòng và phòng ngủ
                                    </div>

                                    <div>
                                        <div className='flex-space' style={{ height: '50px' }}>
                                            <div className='fs-18'>Giường</div>
                                            <IncAndDecBtn
                                                dataEdit='listings__bed-count'
                                                dataTrigger='roomAndBedRoom'
                                            />
                                        </div>
                                        <div className='flex-space' style={{ height: '50px' }}>
                                            <div className='fs-18'>Phòng ngủ</div>
                                            <IncAndDecBtn
                                                dataEdit='listings__bed-room-count'
                                                dataTrigger='roomAndBedRoom'
                                            />
                                        </div>
                                        <div className='flex-space' style={{ height: '50px' }}>
                                            <div className='fs-18'>Phòng tắm</div>
                                            <IncAndDecBtn
                                                dataEdit='listings__bath-room-count'
                                                dataTrigger='roomAndBedRoom'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='index__filter-block'>
                                <div className='index__box-filter-title'>Tiện nghi</div>
                                <div className='listings__filter'>
                                    <div>
                                        <div className='grid-2 ' style={{ height: '80%' }}>
                                            {amenities.length &&
                                                amenities.map(amenity => (
                                                    <div
                                                        className='normal-flex'
                                                        style={{ height: '30px' }}
                                                        key={amenity.id}
                                                    >
                                                        <Checkbox
                                                            onChange={onChange}
                                                            value={amenity.id}
                                                            className='fs-18'
                                                        >
                                                            {amenity.name}
                                                        </Checkbox>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='boxFooter' className='flex-space'>
                            <div>
                                <button
                                    className='manage-photos__cancel-btn'
                                    onClick={() => hideEditThumbnailBox()}
                                >
                                    Hủy
                                </button>
                            </div>
                            <div>
                                <button id='index__filter-btn'>Áp dụng</button>
                            </div>
                        </div>
                    </Div>
                </div>
            </div>
        </>
    );
};

export default FilterRoomBox;