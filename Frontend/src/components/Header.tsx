import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../features/user/userSlice';
import { getImage } from '../helpers/getImage';
import { RootState } from '../store';
import './header.css';

interface IHeaderProps {
    includeMiddle: boolean;
    excludeBecomeHostAndNavigationHeader: boolean;
}

const Header: FC<IHeaderProps> = ({ includeMiddle, excludeBecomeHostAndNavigationHeader }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);

    const jQuerycode = () => {
        const headerNavButton = document.getElementsByClassName('account__button')[0];
        const navMenu = document.getElementsByClassName('loginAndLogoutHidden')[0];
        let isClicked = false;

        headerNavButton.addEventListener('click', function () {
            if (!isClicked) {
                navMenu.classList.add('active');
                isClicked = true;
            } else {
                navMenu.classList.remove('active');
                isClicked = false;
            }
        });
    };

    useEffect(() => {
        jQuerycode();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className='header'>
            <div className='header__container'>
                <div className='header__right'>
                    <Link to='/'>
                        <img
                            src={getImage('/images/airtntlogo.png')}
                            id='airj18-logo'
                            alt='application-logo'
                            className='image'
                        />
                    </Link>
                </div>
                {includeMiddle && (
                    <div className='header__middle'>
                        <ul id='ulMiddle'>
                            <li className='nav__container'>
                                <a href='@{/progress/reviews}' className='nav__link'>
                                    Đánh giá
                                </a>
                            </li>
                            <li className='nav__container'>
                                <a href='@{/progress/earnings}' className='nav__link'>
                                    Thu nhập
                                </a>
                            </li>
                            <li className='nav__container'>
                                <a href='@{/user/bookings}' className='nav__link'>
                                    Phòng đã đặt
                                </a>
                            </li>
                            <li className='nav__container'>
                                <a href='@{/hosting/listings/1}' className='nav__link'>
                                    Quản lí nhà/phòng cho thuê
                                </a>
                            </li>
                            <li className='nav__container'>
                                <a href='@{/booking/listings/1}' className='nav__link'>
                                    Quản lí đặt phòng
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
                <div className='header__left'>
                    {/* isAuthenticated(); */}
                    {!excludeBecomeHostAndNavigationHeader && (
                        <div style={{ marginRight: '20px' }}>
                            <a href='@{/become-a-host/}' className='header__become-host'>
                                Trở thành chủ nhà
                            </a>
                        </div>
                    )}

                    <div className='navMenuHeader'>
                        <div className='account__button'>
                            <div>
                                <svg
                                    viewBox='0 0 32 32'
                                    xmlns='http://www.w3.org/2000/svg'
                                    aria-hidden='true'
                                    role='presentation'
                                    focusable='false'
                                    className='subMenu'
                                >
                                    <g fill='none' fillRule='nonzero'>
                                        <path d='m2 16h28'></path>
                                        <path d='m2 24h28'></path>
                                        <path d='m2 8h28'></path>
                                    </g>
                                </svg>
                            </div>
                            <div>
                                <div id='userAvatarWrapper'>
                                    {user === null ? (
                                        <img
                                            alt="User's avatar'"
                                            className='header__user-avatar'
                                            id='userAvatar'
                                            src={getImage('/images/default_user_avatar.png')}
                                        />
                                    ) : (
                                        <img
                                            alt="User's avatar'"
                                            src={getImage(user.avatarPath)}
                                            className='header__user-avatar'
                                            id='userAvatar'
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='headerBridge'></div>
                        <div className='loginAndLogoutHidden'>
                            {user === null && (
                                <ul>
                                    <li>
                                        <Link to={'/register'}>Đăng ký</Link>
                                    </li>
                                    <li>
                                        <Link to={'/login'}>Đăng nhập</Link>
                                    </li>
                                </ul>
                            )}
                            {user !== null && (
                                <div>
                                    <ul>
                                        <li>
                                            <a href='@{/user/bookings}'>Phòng đã đặt</a>
                                        </li>
                                        <li>
                                            <Link to={'/wishlists'}>Danh sách yêu thích</Link>
                                        </li>
                                        <li>
                                            <Link to='/hosting/listings/1'>
                                                Quản lí nhà/phòng cho thuê
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/account-settings/personal-info'}>
                                                Tài khoản
                                            </Link>
                                        </li>
                                        <li onClick={handleLogout}>Đăng xuất</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
