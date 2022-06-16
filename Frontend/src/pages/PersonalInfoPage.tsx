import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { UserInfo } from "../components/personal_info/UserInfo";
import { getImage, formatDate, getUserSex, callToast } from "../helpers";
import { RootState } from "../store";

import { jqueryCode } from "../components/personal_info/script/personal_info";
import Toast from "../components/notify/Toast";

import "./css/personal_info.css";
import { Image } from "../globalStyle";
import { userState } from "../features/user/userSlice";

type IPersonalInfoPageProps = {};

const PersonalInfoPage: FC<IPersonalInfoPageProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        user,
        update: { loading, successMessage, errorMessage },
    } = useSelector(userState);

    useEffect(() => {
        jqueryCode();
    }, []);

    useEffect(() => {
        if (successMessage === "UPDATE_USER_SUCCESSFULLY")
            callToast("success", "Cập nhật thành công");
    }, [successMessage]);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={false} />
            <Toast />
            {user !== null && (
                <div id='personal-info__page'>
                    <div id='personal-info__container'>
                        <div className='normal-flex'>
                            <span className='personal__info--title'>Tài khoản</span>
                            <div className='personal__info__next-icon'>
                                <Image src={getImage("/svg/next.svg")} size={"10px"} />
                            </div>{" "}
                            <span className='personal__info--title'>Thông tin cá nhân</span>
                        </div>
                        <h2>Thông tin cá nhân</h2>
                        <div id='personal__content-wrapper'>
                            <div className='personal-info__left'>
                                <UserInfo
                                    title='Tên pháp lý'
                                    dataEdit='firstNameAndLastName'
                                    value={user.firstName + " " + user.lastName}
                                />
                                <UserInfo
                                    title='Giới tính'
                                    dataEdit='sex'
                                    value={getUserSex(user.sex)}
                                />
                                <UserInfo
                                    title='Ngày sinh'
                                    dataEdit='birthdayWeb'
                                    value={formatDate(user.birthday)}
                                />
                                <UserInfo
                                    title='Địa chỉ email'
                                    dataEdit='email'
                                    value={user.email}
                                />
                                <UserInfo
                                    title='Mật khẩu'
                                    dataEdit='password'
                                    value={"**********"}
                                />
                                <UserInfo
                                    title='Số điện thoại'
                                    dataEdit='phoneNumber'
                                    value={user.phoneNumber}
                                />
                                <UserInfo
                                    title='Địa chỉ'
                                    dataEdit='address'
                                    value={user.fullPathAddress}
                                />
                                <UserInfo
                                    title='Ảnh đại diện'
                                    dataEdit='avatar'
                                    value={user.avatarPath}
                                />
                            </div>
                            <div id='personal-info__middle--divider'></div>
                            <div id='personal-info__right'>
                                <div>
                                    <div>
                                        <Image src={getImage("/svg/block.svg")} size='40px' />
                                    </div>
                                    <h4>Bạn có thể chỉnh sửa những thông tin nào?</h4>
                                    <p>
                                        Không thể thay đổi thông tin mà Airbnb sử dụng để xác minh
                                        danh tính của bạn. Bạn có thể chỉnh sửa thông tin liên hệ và
                                        một số thông tin cá nhân, nhưng chúng tôi có thể yêu cầu bạn
                                        xác minh danh tính vào lần tới khi bạn đặt phòng hoặc tạo
                                        mục cho thuê.
                                    </p>
                                </div>
                                <div>
                                    <div>
                                        <Image
                                            src={getImage("/svg/paper_identity.svg")}
                                            size='40px'
                                        />
                                    </div>
                                    <h4>Thông tin nào được chia sẻ với người khác?</h4>
                                    <p>
                                        Airbnb chỉ tiết lộ thông tin liên lạc cho Chủ nhà/Người tổ
                                        chức và khách sau khi đặt phòng/đặt chỗ được xác nhận.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PersonalInfoPage;
