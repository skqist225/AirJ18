import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { RootState } from '../../store';

interface IListingsPageProps {}

const ListingsPage: FC<IListingsPageProps> = () => {
    const navigate = useNavigate();
    const { user, loading } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (user === null && !loading) {
            navigate('/login');
        }
    }, []);

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            {/* 
                <div>
            <div className="listings__container">
                <div className="listings__header flex">
                    <div className="listings__header-rooms-length">
                        [[${roomsLength}]] nhà/phòng cho thuê
                    </div>
                    <div>
                        <button className="listings__create-new-room" onclick="createNewRoom();">
                            <span>
                                <img
                                    src="@{/svg/plus.svg}"
                                    alt=""
                                    width="16px"
                                    height="16px"
                                    style="object-fit: cover"
                                />
                            </span>
                            <div style="margin-left: 10px">Tạo mục cho thuê</div>
                        </button>
                    </div>
                </div>
                <div className="listings__filter-container">
                    <div className="listings__search-room">
                        <div className="listings__search-icon-container" onclick="filterRoomByName();">
                            <img src="@{/svg/search.svg}" alt="" width="12px" height="12px" />
                        </div>
                        <div style="flex: 1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhà/phòng cho thuê"
                                id="listings__search-input"
                            />
                        </div>
                    </div>
                    <div className="listings__filter">
                        <button
                            className="listings__filter-option"
                            data-dropdown="listings__filter-roomAndBedRoom"
                        >
                            <span> Phòng và phòng ngủ</span>
                            <div className="listings__filter-img-container">
                                <img
                                    src="@{/svg/dropdown.svg}"
                                    alt=""
                                    width="12px"
                                    height="12px"
                                />
                            </div>
                        </button>
                        <div id="listings__filter-roomAndBedRoom">
                            <div className="listings__filter-wrapper">
                                <div className="filter-box">
                                    <div className="flex listings__filter-roomAndBedRoom-row">
                                        <div>Phòng ngủ</div>
                                        <div
                                            replace="hosting/_listings_partial :: incAndDecBtn('listings__bed-room-count', 'roomAndBedRoom')"
                                        ></div>
                                    </div>
                                    <div className="flex listings__filter-roomAndBedRoom-row">
                                        <div>Giường</div>
                                        <div
                                            replace="hosting/_listings_partial :: incAndDecBtn('listings__bed-count', 'roomAndBedRoom')"
                                        ></div>
                                    </div>
                                    <div className="flex listings__filter-roomAndBedRoom-row">
                                        <div>Phòng tắm</div>
                                        <div
                                            replace="hosting/_listings_partial :: incAndDecBtn('listings__bath-room-count', 'roomAndBedRoom')"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    replace="hosting/_listings_partial :: filterFooter('roomAndBedRoom')"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="listings__filter">
                        <button
                            className="listings__filter-option"
                            data-dropdown="listings__filter-amentities"
                        >
                            <span>Tiện nghi</span>
                            <div className="listings__filter-img-container">
                                <img
                                    src="@{/svg/dropdown.svg}"
                                    alt=""
                                    width="12px"
                                    height="12px"
                                />
                            </div>
                        </button>
                        <div id="listings__filter-amentities">
                            <div className="grid-2 filter-box" style="height: 80%">
                                <block each="amentity : ${amentities}">
                                    <div
                                        className="listings__filter-amentities-row"
                                        style="display: flex; align-items: center"
                                    >
                                        <div className="flex-2">
                                            <input
                                                type="checkbox"
                                                width="20px"
                                                height="20px"
                                                value="${amentity.id}"
                                                className="amentitySelected"
                                            />
                                        </div>
                                        <div
                                            style="font-size: 14px; margin-left: 8px; height: 35px"
                                            className="flex-2"
                                        >
                                            [[${amentity.name}]]
                                        </div>
                                    </div>
                                </block>
                            </div>
                            <div
                                replace="hosting/_listings_partial :: filterFooter('amentities')"
                            ></div>
                        </div>
                    </div>
                    <div className="listings__filter">
                        <button
                            className="listings__filter-option"
                            data-dropdown="listings__filter-status"
                        >
                            <span>Tình trạng nhà/phòng cho thuê</span>
                            <div className="listings__filter-img-container">
                                <img
                                    src="@{/svg/dropdown.svg}"
                                    alt=""
                                    width="12px"
                                    height="12px"
                                />
                            </div>
                        </button>
                        <div id="listings__filter-status">
                            <div className="listings__filter-wrapper">
                                <div style="padding: 24px; flex: 1">
                                    <div className="normal-flex listings__filter-status-row">
                                        <input
                                            type="checkbox"
                                            className="statusSelected"
                                            value="ACTIVE"
                                        />
                                        <div>Đã đăng</div>
                                    </div>
                                    <div className="normal-flex listings__filter-status-row">
                                        <input
                                            type="checkbox"
                                            className="statusSelected"
                                            value="UNLISTED"
                                        />
                                        <div>Đã hủy đăng</div>
                                    </div>
                                </div>
                                <div
                                    replace="hosting/_listings_partial :: filterFooter('status')"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <!-- <div className="listings__filter">
                        <button
                            className="listings__filter-option"
                            data-dropdown="listings__filter-others"
                        >
                            <span>Các bộ lọc khác</span>
                            <div className="listings__filter-img-container">
                                <img
                                    src="@{/svg/dropdown.svg}"
                                    alt=""
                                    width="12px"
                                    height="12px"
                                />
                            </div>
                        </button>
                        <div id="listings__filter-others">
                            <div className="listings__filter-wrapper">
                                <div className="filter-box" style="overflow: hidden">
                                    <div className="normal-flex listings__filter-others-row">
                                        <input
                                            type="checkbox"
                                            id="listings__filter-others__first-option"
                                        />
                                        <div>Chế độ Đặt ngay đang tắt</div>
                                    </div>
                                    <div className="normal-flex listings__filter-others-row">
                                        <input
                                            type="checkbox"
                                            id="listings__filter-others__second-option"
                                        />
                                        <div>Yêu cầu cập nhật mục cho thuê</div>
                                    </div>
                                </div>
                                <div
                                    replace="hosting/_listings_partial :: filterFooter('others')"
                                ></div>
                            </div>
                        </div>
                    </div> -->
                    <div className="listings__filter">
                        <button
                            className="listings__filter-option deleteAllFilterOption"
                            data-dropdown="listings__filter-others"
                        >
                            <span>Xóa toàn bộ bộ lọc</span>
                        </button>
                    </div>
                </div>
                <div style="flex: 1">
                    <div replace="hosting/_listings_partial :: listingsTable(${rooms})"></div>
                </div>
                <div className="pagination">
                    <a data-page="prev">&laquo;</a>
                    <a data-page="1" className="active listings__link">1</a>
                    <a data-page="2" className="listings__link">2</a>
                    <a data-page="3" className="listings__link">3</a>
                    <a data-page="4" className="listings__link">4</a>
                    <a data-page="5" className="listings__link">5</a>
                    <a data-page="6" className="listings__link">6</a>
                    <a data-page="next">&raquo;</a>
                </div>
            </div>
        </main> */}
        </>
    );
};

export default ListingsPage;
