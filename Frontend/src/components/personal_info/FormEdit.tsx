import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    FirstNameAndLastNameEdit,
    SexEdit,
    BirthdayEdit,
    EmailEdit,
    PhoneNumberEdit,
    AvatarEdit,
    AddressEdit,
    PasswordEdit,
} from './components';
import {
    checkBirthdayIsGreaterThenPresent,
    checkEmailDuplicated,
    checkFirstNameAndLastNameConstraint,
    checkPasswordConstraint,
    checkPhoneNumberConstraint,
} from './js/check_constraints';
import $ from 'jquery';
import { updateUserInfo } from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import Toast from '../notify/Toast';
import { IUserUpdate } from '../../type/user/type_User';

interface IFormEditProps {
    dataEdit: string;
}

export const FormEdit: FC<IFormEditProps> = ({ dataEdit }) => {
    const dispatch = useDispatch();

    const { handleSubmit, register } = useForm();
    const {
        user,
        update: { loading, successMessage, errorMessage },
    } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (errorMessage === 'UPDATE_USER_FAILURE')
            toast.error('🦄' + `Cập nhật thất bại`, {
                position: 'bottom-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    }, [errorMessage]);

    function updateInfo(updateInfo: IUserUpdate, field: string) {
        dispatch(updateUserInfo(updateInfo));
    }

    const onSubmit = async (data: any) => {
        console.log(data);

        switch (dataEdit) {
            case 'firstNameAndLastName': {
                const { firstName, lastName } = data;
                const status = await checkFirstNameAndLastNameConstraint(firstName, lastName);

                if (status === 'OK')
                    updateInfo(
                        {
                            updatedField: 'firstNameAndLastName',
                            updateData: {
                                firstName,
                                lastName,
                            },
                        },
                        'họ và tên'
                    );
                break;
            }
            case 'sex': {
                const { sex } = data;
                updateInfo(
                    {
                        updatedField: 'sex',
                        updateData: {
                            sex,
                        },
                    },
                    'giới tính'
                );
                break;
            }
            case 'birthday': {
                const { yearOfBirth, monthOfBirth, dayOfBirth } = data;
                const status = checkBirthdayIsGreaterThenPresent(
                    yearOfBirth,
                    monthOfBirth,
                    dayOfBirth
                );

                if (status === 'OK')
                    updateInfo(
                        {
                            updatedField: 'birthday',
                            updateData: {
                                yearOfBirth,
                                monthOfBirth,
                                dayOfBirth,
                            },
                        },
                        'ngày sinh'
                    );

                break;
            }
            case 'email': {
                const { email } = data;
                const status = await checkEmailDuplicated(email, user!.id);
                console.log(status);
                if (status === 'OK')
                    updateInfo(
                        {
                            updatedField: 'email',
                            updateData: {
                                email,
                            },
                        },
                        'email'
                    );
                break;
            }
            case 'password': {
                const { oldPassword, newPassword } = data;

                const status = await checkPasswordConstraint(oldPassword, newPassword, user!.id);
                if (status === 'OK')
                    updateInfo(
                        {
                            updatedField: 'password',
                            updateData: {
                                newPassword,
                            },
                        },
                        'mật khẩu'
                    );

                break;
            }
            case 'phoneNumber': {
                checkPhoneNumberConstraint(data.phoneNumber);
                break;
            }
            case 'address': {
                break;
            }
            case 'avatar': {
                break;
            }
        }
    };

    return (
        <>
            {user !== null && (
                <form onSubmit={handleSubmit(onSubmit)} className={'formEdit_' + dataEdit}>
                    <input type='hidden' value={user.id} name='id' />
                    <input type='hidden' name='updatedField' value={dataEdit} />
                    <div></div>
                    {dataEdit === 'firstNameAndLastName' && (
                        <FirstNameAndLastNameEdit
                            firstName={user.firstName}
                            lastName={user.lastName}
                            register={register}
                        />
                    )}

                    {dataEdit === 'sex' && <SexEdit register={register} defaultValue={user.sex} />}
                    {dataEdit === 'birthday' && (
                        <BirthdayEdit birthday={user.birthday} register={register} />
                    )}
                    {dataEdit === 'email' && (
                        <EmailEdit register={register} defaultValue={user.email} />
                    )}
                    {dataEdit === 'password' && <PasswordEdit register={register} />}
                    {dataEdit === 'phoneNumber' && (
                        <PhoneNumberEdit register={register} defaultValue={user.phoneNumber} />
                    )}
                    {dataEdit === 'address' && (
                        <AddressEdit
                            register={register}
                            address={user.addressDetails}
                            countryDefaultValue={user.addressDetails.country.id}
                            stateDefaultValue={user.addressDetails.state.id}
                            cityDefaultValue={user.addressDetails.city.id}
                        />
                    )}
                    {dataEdit === 'avatar' && <AvatarEdit register={register} />}

                    <button type='submit' className='saveEditBtn' data-edit={dataEdit}>
                        <span>Lưu</span>
                    </button>
                </form>
            )}
        </>
    );
};
