import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import { AmenityRow } from '../../../components/hosting/listings/AmenityRow';
import { FilterFooter } from '../../../components/hosting/listings/FilterFooter';
import { IncAndDecBtn } from '../../../components/hosting/listings/IncAndDecBtn';
import hostingListings from '../../../components/hosting/listings/js/listings';
import { Pagination } from '../../../components/hosting/listings/Pagination';
import { RoomDataRow } from '../../../components/hosting/listings/RoomDataRow';
import { fetchAmenities } from '../../../features/amenity/amenitySlice';
import { fetchUserOwnedRoom } from '../../../features/room/roomSlice';
import { getImage } from '../../../helpers/getImage';
import { RootState } from '../../../store';
import './css/listings_page.css';

interface IListingsPageProps {}

const ListingsPage: FC<IListingsPageProps> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state: RootState) => state.user);
    const { amenities, loading: amenityLoading } = useSelector((state: RootState) => state.amenity);
    const {
        hosting: { rooms, totalRecords },
    } = useSelector((state: RootState) => state.room);
    const { pathname } = useLocation();

    useEffect(() => {
        if (user === null && !loading) {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        dispatch(fetchAmenities());
    }, []);

    useEffect(() => {
        dispatch(fetchUserOwnedRoom({ pageNumber: parseInt(pathname.split('/').pop() as string) }));
    }, [pathname]);

    useEffect(() => {
        hostingListings();
    }, [rooms]);

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            {rooms.length ? (
                <div id='listings__main-conainer'>
                    <div className='listings__container'>
                        <div className='listings__header flex'>
                            <div className='listings__header-rooms-length'>
                                {totalRecords} nhà/phòng cho thuê
                            </div>
                            <div>
                                <Link to={'/'}>
                                    {' '}
                                    <button className='listings__create-new-room'>
                                        <span>
                                            <img
                                                src={getImage('/svg/plus.svg')}
                                                alt=''
                                                width='16px'
                                                height='16px'
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </span>
                                        <div style={{ marginLeft: '10px' }}>Tạo mục cho thuê</div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className='listings__filter-container'>
                            <div className='listings__search-room'>
                                <div className='listings__search-icon-container'>
                                    <img
                                        src={getImage('/svg/search.svg')}
                                        alt=''
                                        width='12px'
                                        height='12px'
                                    />
                                </div>
                                <div className='f1'>
                                    <input
                                        type='text'
                                        placeholder='Tìm kiếm nhà/phòng cho thuê'
                                        id='listings__search-input'
                                    />
                                </div>
                            </div>
                            <div className='listings__filter'>
                                <button
                                    className='listings__filter-option'
                                    data-dropdown='listings__filter-roomAndBedRoom'
                                >
                                    <span> Phòng và phòng ngủ</span>
                                    <div className='listings__filter-img-container'>
                                        <img
                                            src={getImage('/svg/dropdown.svg')}
                                            alt=''
                                            width='12px'
                                            height='12px'
                                        />
                                    </div>
                                </button>
                                <div id='listings__filter-roomAndBedRoom'>
                                    <div className='listings__filter-wrapper'>
                                        <div className='filter-box'>
                                            <div className='flex listings__filter-roomAndBedRoom-row'>
                                                <div>Phòng ngủ</div>
                                                <IncAndDecBtn
                                                    dataEdit='listings__bed-room-count'
                                                    dataTrigger='roomAndBedRoom'
                                                />
                                            </div>
                                            <div className='flex listings__filter-roomAndBedRoom-row'>
                                                <div>Giường</div>
                                                <IncAndDecBtn
                                                    dataEdit='listings__bed-count'
                                                    dataTrigger='roomAndBedRoom'
                                                />
                                            </div>
                                            <div className='flex listings__filter-roomAndBedRoom-row'>
                                                <div>Phòng tắm</div>
                                                <IncAndDecBtn
                                                    dataEdit='listings__bath-room-count'
                                                    dataTrigger='roomAndBedRoom'
                                                />
                                            </div>
                                        </div>

                                        <FilterFooter footerOf='roomAndBedRoom' />
                                    </div>
                                </div>
                            </div>
                            <div className='listings__filter'>
                                <button
                                    className='listings__filter-option'
                                    data-dropdown='listings__filter-amentities'
                                >
                                    <span>Tiện nghi</span>
                                    <div className='listings__filter-img-container'>
                                        <img
                                            src={getImage('/svg/dropdown.svg')}
                                            alt=''
                                            width='12px'
                                            height='12px'
                                        />
                                    </div>
                                </button>
                                <div id='listings__filter-amentities'>
                                    <div className='grid-2 filter-box h-80'>
                                        {amenities.map(amenity => (
                                            <AmenityRow amenity={amenity} key={amenity.id} />
                                        ))}
                                    </div>

                                    <FilterFooter footerOf='amentities' />
                                </div>
                            </div>
                            <div className='listings__filter'>
                                <button
                                    className='listings__filter-option'
                                    data-dropdown='listings__filter-status'
                                >
                                    <span>Tình trạng nhà/phòng cho thuê</span>
                                    <div className='listings__filter-img-container'>
                                        <img
                                            src={getImage('/svg/dropdown.svg')}
                                            alt=''
                                            width='12px'
                                            height='12px'
                                        />
                                    </div>
                                </button>
                                <div id='listings__filter-status'>
                                    <div className='listings__filter-wrapper'>
                                        <div className='f1 p-24'>
                                            <div className='normal-flex listings__filter-status-row'>
                                                <input
                                                    type='checkbox'
                                                    className='statusSelected'
                                                    value='ACTIVE'
                                                />
                                                <div>Đã đăng</div>
                                            </div>
                                            <div className='normal-flex listings__filter-status-row'>
                                                <input
                                                    type='checkbox'
                                                    className='statusSelected'
                                                    value='UNLISTED'
                                                />
                                                <div>Đã hủy đăng</div>
                                            </div>
                                        </div>

                                        <FilterFooter footerOf='status' />
                                    </div>
                                </div>
                            </div>
                            <div className='listings__filter'>
                                <button
                                    className='listings__filter-option'
                                    data-dropdown='listings__filter-others'
                                >
                                    <span>Các bộ lọc khác</span>
                                    <div className='listings__filter-img-container'>
                                        <img
                                            src={getImage('/svg/dropdown.svg')}
                                            alt=''
                                            width='12px'
                                            height='12px'
                                        />
                                    </div>
                                </button>
                                <div id='listings__filter-others'>
                                    <div className='listings__filter-wrapper'>
                                        <div className='filter-box overflow-hidden'>
                                            <div className='normal-flex listings__filter-others-row'>
                                                <input
                                                    type='checkbox'
                                                    id='listings__filter-others__first-option'
                                                />
                                                <div>Chế độ Đặt ngay đang tắt</div>
                                            </div>
                                            <div className='normal-flex listings__filter-others-row'>
                                                <input
                                                    type='checkbox'
                                                    id='listings__filter-others__second-option'
                                                />
                                                <div>Yêu cầu cập nhật mục cho thuê</div>
                                            </div>
                                        </div>

                                        <FilterFooter footerOf='others' />
                                    </div>
                                </div>
                            </div>
                            <div className='listings__filter'>
                                <button
                                    className='listings__filter-option deleteAllFilterOption'
                                    data-dropdown='listings__filter-others'
                                >
                                    <span>Xóa toàn bộ bộ lọc</span>
                                </button>
                            </div>
                        </div>
                        <div className='f1'>
                            <table id='table'>
                                <thead>
                                    <tr>
                                        <th>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='id'
                                                >
                                                    <div>MÃ PHÒNG</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='name'
                                                >
                                                    <div>NHÀ/PHÒNG CHO THUÊ</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='status'
                                                >
                                                    <div>TRẠNG THÁI</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='price'
                                                >
                                                    <div>GIÁ PHÒNG MỖI ĐÊM</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='category-name'
                                                >
                                                    <div>LOẠI PHÒNG</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th data-column='BEDROOM'>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='bedroomCount'
                                                >
                                                    <div>PHÒNG NGỦ</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th data-column='BED'>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='bedCount'
                                                >
                                                    <div>GIƯỜNG</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th data-column='BATHROOM'>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='bathroomCount'
                                                >
                                                    <div>PHÒNG TẮM</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th style={{ width: '400px' }}>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='location'
                                                >
                                                    <div>VỊ TRÍ</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th data-column='LASTMODIFIED'>
                                            <div>
                                                <button
                                                    className='listings__table-header'
                                                    data-sort-field='lastModified'
                                                >
                                                    <div>SỬA ĐỔI LẦN CUỐI</div>
                                                    <div className='listings__fiter-icon-container'>
                                                        <span className='upper'> </span>
                                                        <span className='downer'></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </th>
                                        <th>
                                            <div className='p-relative'>
                                                <div
                                                    className='listings__filter-option'
                                                    data-dropdown='listings__setting-column-display'
                                                >
                                                    <img
                                                        src={getImage('/svg/setting.svg')}
                                                        alt=''
                                                        width='20px'
                                                        height='20px'
                                                    />
                                                </div>
                                                <div
                                                    id='listings__setting-column-display'
                                                    className='filter-box'
                                                >
                                                    <div className='listings__setting-column-display-header'>
                                                        Tùy chỉnh cột
                                                    </div>
                                                    <div style={{ height: '80%' }} className='f1'>
                                                        <div className='normal-flex listings__setting-column-display-row'>
                                                            <input
                                                                type='checkbox'
                                                                className='columnDisplay'
                                                                value='COMMONNAME'
                                                            />
                                                            <div className='fs-14'>
                                                                TÊN THƯỜNG GỌI
                                                            </div>
                                                        </div>
                                                        <div className='normal-flex listings__setting-column-display-row'>
                                                            <input
                                                                type='checkbox'
                                                                checked={true}
                                                                className='columnDisplay'
                                                                value='BEDROOM'
                                                            />
                                                            <div className='fs-14'>PHÒNG NGỦ</div>
                                                        </div>
                                                        <div className='normal-flex listings__setting-column-display-row'>
                                                            <input
                                                                type='checkbox'
                                                                checked={true}
                                                                className='columnDisplay'
                                                                value='BED'
                                                            />
                                                            <div className='fs-14'>GIƯỜNG</div>
                                                        </div>
                                                        <div className='normal-flex listings__setting-column-display-row'>
                                                            <input
                                                                type='checkbox'
                                                                checked={true}
                                                                className='columnDisplay'
                                                                value='BATHROOM'
                                                            />
                                                            <div className='fs-14'>PHÒNG TẮM</div>
                                                        </div>
                                                        <div className='normal-flex listings__setting-column-display-row'>
                                                            <input
                                                                type='checkbox'
                                                                checked={true}
                                                                className='columnDisplay'
                                                                value='LASTMODIFIED'
                                                            />
                                                            <div className='fs-14'>
                                                                SỬA ĐỔI LẦN CUỐI
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map(room => (
                                        <RoomDataRow
                                            room={room}
                                            key={room.id}
                                            email={user!.email}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination />
                    </div>
                </div>
            ) : (
                <div className='flex-2 no-room-style'>Không tìm thấy kết quả</div>
            )}
        </>
    );
};

export default ListingsPage;
