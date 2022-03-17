import { FC } from 'react';

import './css/side_bar.css';

interface ISideBarProps {
    roomName: string;
}

const SideBar: FC<ISideBarProps> = ({ roomName }) => {
    return (
        <div className='manage--ys__left'>
            <div id='manage--ys__roomName'>{roomName}</div>
            <div className='manage--ys__scrolling--menu'>
                <div className='manage--ys__title'>Chi tiết nhà/phòng cho thuê</div>
                <div className='menuContainer'>
                    <ul>
                        <li className='active' data-index='1'>
                            <div className='li-before' id='roomImagesKf'></div>
                            <a className='manage-ys__changeView' data-scroll='#roomImages'>
                                Ảnh
                            </a>
                        </li>
                        <li data-index='2'>
                            <div className='li-before' id='basicRoomInfosKf'></div>
                            <a className='manage-ys__changeView' data-scroll='#basicRoomInfos'>
                                Thông tin cơ bản về nhà/phòng cho thuê
                            </a>
                        </li>
                        <li data-index='3'>
                            <div className='li-before' id='roomAmentitiesKf'></div>
                            <a className='manage-ys__changeView' data-scroll='#roomAmentities'>
                                Tiện nghi
                            </a>
                        </li>
                        <li data-index='4'>
                            <div className='li-before' id='roomLocationKf'></div>
                            <a className='manage-ys__changeView' data-scroll='#roomLocation'>
                                Vị trí
                            </a>
                        </li>
                        <li data-index='5'>
                            <div className='li-before' id='roomInfoKf'></div>
                            <a className='manage-ys__changeView' data-scroll='#roomInfo'>
                                Chỗ ở và phòng
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
