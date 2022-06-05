import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import {
    fetchRoomsByCategoryAndConditions,
    resetCurretnFilterObject,
} from "../features/room/roomSlice";
import { userState } from "../features/user/userSlice";
import { getImage } from "../helpers";
import "./header.css";

interface IHeaderProps {
    includeMiddle: boolean;
    excludeBecomeHostAndNavigationHeader: boolean;
}

const Header: FC<IHeaderProps> = ({ includeMiddle, excludeBecomeHostAndNavigationHeader }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(userState);

    const jQuerycode = () => {
        const headerNavButton = document.getElementsByClassName("account__button")[0];
        const navMenu = document.getElementsByClassName("loginAndLogoutHidden")[0];
        let isClicked = false;

        headerNavButton.addEventListener("click", function () {
            if (!isClicked) {
                navMenu.classList.add("active");
                isClicked = true;
            } else {
                navMenu.classList.remove("active");
                isClicked = false;
            }
        });
    };

    useEffect(() => {
        jQuerycode();
    }, []);

    const handleLogout = () => {
        dispatch(logout({}));
    };

    function refreshPage() {
        dispatch(resetCurretnFilterObject());
        dispatch(fetchRoomsByCategoryAndConditions({ categoryid: 1 }));

        window.location.href = "/";
    }

    return (
        <header className='header'>
            <div className='header__container'>
                <div className='header__right'>
                    <button
                        style={{ outline: "none", border: "none", backgroundColor: "none" }}
                        onClick={refreshPage}
                    >
                        <img
                            src={getImage("/images/airtntlogo.png")}
                            id='airj18-logo'
                            alt='application-logo'
                            className='image'
                        />
                    </button>
                </div>
                {includeMiddle && (
                    <div className='header__middle'>
                        <ul id='ulMiddle'>
                            <li className='nav__container'>
                                <Link to='/progress/reviews' className='nav__link'>
                                    Đánh giá
                                </Link>
                            </li>
                            <li className='nav__container'>
                                <Link to='/progress/earnings' className='nav__link'>
                                    Thu nhập
                                </Link>
                            </li>
                            <li className='nav__container'>
                                <Link to='/user/booked-rooms' className='nav__link'>
                                    Phòng đã đặt
                                </Link>
                            </li>
                            <li className='nav__container'>
                                <Link to='/hosting/listings/1' className='nav__link'>
                                    Quản lí nhà/phòng cho thuê
                                </Link>
                            </li>
                            <li className='nav__container'>
                                <Link to='/booking/listings/1' className='nav__link'>
                                    Quản lí đặt phòng
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
                <div className='header__left'>
                    {!excludeBecomeHostAndNavigationHeader && (
                        <div style={{ marginRight: "20px" }}>
                            <Link to={"/become-a-host/intro"} className='header__become-host'>
                                Trở thành chủ nhà
                            </Link>
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
                                            src={getImage("/images/default_user_avatar.png")}
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
                                        <Link to={"/auth/register"}>Đăng ký</Link>
                                    </li>
                                    <li>
                                        <Link to={"/auth/login"}>Đăng nhập</Link>
                                    </li>
                                </ul>
                            )}
                            {user !== null && (
                                <div>
                                    <ul>
                                        <li>
                                            <Link to={"/user/booked-rooms"}>Phòng đã đặt</Link>
                                        </li>
                                        <li>
                                            <Link to={"/wishlists"}>Danh sách yêu thích</Link>
                                        </li>
                                        <li>
                                            <Link to='/hosting/listings/1'>
                                                Quản lí nhà/phòng cho thuê
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/account-settings/personal-info"}>
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
