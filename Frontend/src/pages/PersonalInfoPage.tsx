import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { UserInfo } from '../components/personal_info/UserInfo';
import formatDate from '../helpers/formatDate';
import { getImage } from '../helpers/getImage';
import getUserSex from '../helpers/getUserSex';
import { RootState } from '../store';
import './css/personal_info.css';
import { jqueryCode } from '../components/personal_info/js/personalInfo';

type IPersonalInfoPageProps = {};

const PersonalInfoPage: FC<IPersonalInfoPageProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        jqueryCode();
    }, []);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={false} />

            {user !== null && (
                <div id='personal-info__page'>
                    <div id='personal-info__container'>
                        <div className='normal-flex'>
                            <span className='personal__info--title'>Tài khoản</span>
                            <div className='personal__info__next-icon'>
                                <img
                                    src={getImage('/svg/next.svg')}
                                    alt=''
                                    width={'10px'}
                                    height={'10px'}
                                />
                            </div>{' '}
                            <span className='personal__info--title'>Thông tin cá nhân</span>
                        </div>
                        <h2>Thông tin cá nhân</h2>
                        <div id='personal__content-wrapper'>
                            <div className='personal-info__left'>
                                <UserInfo
                                    title='Tên pháp lý'
                                    dataEdit='firstNameAndLastName'
                                    value={user.firstName + ' ' + user.lastName}
                                />
                                <UserInfo
                                    title='Giới tính'
                                    dataEdit='sex'
                                    value={getUserSex(user.sex)}
                                />
                                <UserInfo
                                    title='Ngày sinh'
                                    dataEdit='birthday'
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
                                    value={'**********'}
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
                                        <img
                                            src={getImage('/svg/block.svg')}
                                            alt=''
                                            width={'40px'}
                                            height={'40px'}
                                        />
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
                                        <img
                                            src={getImage('/svg/paper_identity.svg')}
                                            alt=''
                                            width={'40px'}
                                            height={'40px'}
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
