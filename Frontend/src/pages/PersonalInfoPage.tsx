import { userInfo } from 'os';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FormEdit } from '../components/personal_info/FormEdit';
import formatDate from '../helpers/formatDate';
import { getImage } from '../helpers/getImage';
import getUserSex from '../helpers/getUserSex';
import { RootState } from '../store';
import './css/personal_info.css';

type IPersonalInfoPageProps = {};

const PersonalInfoPage: FC<IPersonalInfoPageProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.user);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={false} />

            {user !== null && (
                <div className='personal__info_page'>
                    <div className='page__container'>
                        <div>
                            Tài khoản <span>{'>'}</span> Thông tin cá nhân
                        </div>
                        <h2>Thông tin cá nhân</h2>
                        <div style={{ display: 'flex', alignItems: 'flex-start !important' }}>
                            <div className='personal__info' style={{ flex: 1, maxWidth: '65%' }}>
                                <FormEdit
                                    title='Tên pháp lý'
                                    dataEdit='firstNameAndLastName'
                                    value={user.firstName + ' ' + user.lastName}
                                />
                                <FormEdit
                                    title='Giới tính'
                                    dataEdit='sex'
                                    value={getUserSex(user.sex)}
                                />
                                <FormEdit
                                    title='Ngày sinh'
                                    dataEdit='birthday'
                                    value={formatDate(user.birthday.join('-'))}
                                />
                                <FormEdit
                                    title='Địa chỉ email'
                                    dataEdit='email'
                                    value={user.email}
                                />
                                <FormEdit
                                    title='Mật khẩu'
                                    dataEdit='password'
                                    value={'**********'}
                                />

                                <FormEdit
                                    title='Số điện thoại'
                                    dataEdit='phoneNumber'
                                    value={user.phoneNumber}
                                />
                                <FormEdit
                                    title='Địa chỉ'
                                    dataEdit='address'
                                    value={user.fullPathAddress}
                                />
                                <FormEdit
                                    title='Ảnh đại diện'
                                    dataEdit='avatar'
                                    value={user.avatarPath}
                                />
                            </div>
                            <div style={{ flex: 1, maxWidth: '5%' }}></div>
                            <div
                                style={{
                                    flex: 1,
                                    maxWidth: '30%',
                                    padding: '0 24px',
                                    border: '1px solid #e4e4e4',
                                    height: 'fit-content',
                                }}
                            >
                                <div style={{ margin: '32px 0' }}>
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
