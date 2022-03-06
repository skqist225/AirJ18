import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeCategories } from '../components/home/HomeCategories';
import { fetchCategories } from '../features/category/categorySlice';
import { fetchRoomPrivacies, fetchRoomsByCategoryId } from '../features/room/roomSlice';
import { RootState } from '../store';
import { Rooms } from '../components/home/Rooms';
import Header from '../components/Header';

import '../components/home/css/home.css';
import { Div, Image } from '../globalStyle';
import { getImage } from '../helpers/getImage';
import { ToastContainer } from 'react-toastify';

import { fetchAmenities } from '../features/amenity/amenitySlice';
import { IncAndDecBtn } from '../components/hosting/listings/IncAndDecBtn';
import $ from 'jquery';

type HomeProps = {};

const HomePage: FC<HomeProps> = () => {
    const dispatch = useDispatch();
    const categoryid = 1;

    const {
        rooms,
        loading: roomLoading,
        roomPrivacies,
    } = useSelector((state: RootState) => state.room);
    const { categories, loading: categoryLoading } = useSelector(
        (state: RootState) => state.category
    );
    const { amenities } = useSelector((state: RootState) => state.amenity);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchRoomsByCategoryId({ categoryid }));
    }, [dispatch, categoryid]);

    useEffect(() => {
        dispatch(fetchRoomPrivacies());
        dispatch(fetchAmenities());
    }, []);

    function hideEditThumbnailBox() {
        // $('.radioThumbnail').each(function () {
        //     if ($(this).val() === thumbnail) {
        //         $(this).prop('checked', true);
        //     } else $(this).prop('checked', false);
        // });

        $('#chooseRoomThumbnail').css('display', 'none');
        $('#home__mainContainer').removeClass('remove-scroll');
    }

    return (
        <div className='p-relative' id='home__mainContainer'>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            <div>
                <div className='home__body'>
                    {!categoryLoading && <HomeCategories categories={categories} />}
                    <div>{!roomLoading && <Rooms rooms={rooms} />}</div>
                </div>
                <div>
                    <div>
                        <div>
                            <Image src={getImage('/svg/close.svg')} size='12px' />
                            <div>Danh sách yêu thích của bạn</div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>

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
                                <div className='grid2'>
                                    {roomPrivacies.map(privacy => (
                                        <div className='normal-flex' style={{ padding: '12px 0' }}>
                                            <div>
                                                <input
                                                    type='checkbox'
                                                    name='privacyFilter'
                                                    value={privacy.id}
                                                />
                                            </div>
                                            <div>
                                                <div
                                                    style={{ color: 'rgb(34, 34, 34)' }}
                                                    className='fs-16'
                                                >
                                                    {privacy.name}
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
                                        <input
                                            type='range'
                                            className='form-range'
                                            min='0'
                                            max='10000000'
                                            id='roomPriceRange'
                                            // onchange='updateTextInput(this.value);'
                                            style={{ width: '400px' }}
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
                                                />
                                            </div>
                                        </div>
                                        <div style={{ margin: '8px' }}>-</div>
                                        <div className='max-price-button'>
                                            <div className='max-price-title'>giá tối đa</div>
                                            <div className='normal-flex'>
                                                <span>đ</span>
                                                <input
                                                    type='number'
                                                    className='max-price-input'
                                                    id='max-input__modify'
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
                                        <div>
                                            Nhà/phòng cho thuê bạn có thể đặt mà không cần chờ chủ
                                            nhà chấp thuận
                                        </div>
                                        <div>
                                            <input type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='index__filter-block'>
                                <div>
                                    <div className='index__box-filter-title'>
                                        Phòng và phòng ngủ
                                    </div>

                                    <div className='filter-box'>
                                        <div className='flex-space listings__filter-roomAndBedRoom-row'>
                                            <div>Giường</div>
                                            <IncAndDecBtn
                                                dataEdit='listings__bed-count'
                                                dataTrigger='roomAndBedRoom'
                                            />
                                        </div>
                                        <div className='flex-space listings__filter-roomAndBedRoom-row'>
                                            <div>Phòng ngủ</div>
                                            <IncAndDecBtn
                                                dataEdit='listings__bed-room-count'
                                                dataTrigger='roomAndBedRoom'
                                            />
                                        </div>
                                        <div className='flex-space listings__filter-roomAndBedRoom-row'>
                                            <div>Phòng tắm</div>
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
                                    <div id='listings__filter-amentities'>
                                        <div
                                            className='grid-2 filter-box'
                                            style={{ height: '80%' }}
                                        >
                                            {amenities.length &&
                                                amenities.map(amenity => (
                                                    <div className='listings__filter-amentities-row normal-flex'>
                                                        <div className='flex-center'>
                                                            <input
                                                                type='checkbox'
                                                                value={amenity.id}
                                                                className='amentitySelected'
                                                            />
                                                        </div>
                                                        <div className='flex-center amentity-name'>
                                                            {amenity.name}
                                                        </div>
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

            <ToastContainer
                position='bottom-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default HomePage;
